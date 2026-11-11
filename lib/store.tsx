'use client';
// One shared, browser-local store so the whole workflow runs across the
// student, teacher, assistant and parent views in the same browser.
import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import { exams, nourSeed, linaSeed, type SeedAnswer } from './data';

export type Status = 'due' | 'submitted' | 'checked' | 'drafted' | 'confirmed' | 'released';
export type Actor = 'student' | 'teacher' | 'assistant' | 'parent' | 'ai';

export interface AnswerState extends SeedAnswer {
  text: string;            // current text after the check
  checked: boolean;
  unreadable: boolean;
  marks: number[];         // current marks per step
  notInScheme: boolean;
  comment: string;
  confirmed: boolean;      // confirmed by the teacher
}
export interface Submission {
  id: string; studentId: string; examId: string; status: Status;
  answers: AnswerState[]; comment: string; draftedBy?: Actor;
}
export interface Flag {
  id: string; studentId: string; title: string; detail: string; evidence: string[];
  state: 'open' | 'confirmed' | 'dismissed'; note: string;
}
export interface Notif { id: string; to: 'student' | 'parent'; text: string; href: string; read: boolean }
export interface AuditEvent { t: string; actor: Actor; text: string }

export interface State {
  submissions: Record<string, Submission>;
  flags: Flag[];
  notifs: Notif[];
  audit: AuditEvent[];
  announced: string[];
  practiceDone: number;
  memoryOn: boolean;
  role: 'teacher' | 'assistant';
  photos: number;          // hand-in wizard progress
}

const answersFrom = (seed: SeedAnswer[]): AnswerState[] => seed.map((s) => ({
  ...s, text: s.ocr, checked: false, unreadable: false, marks: [...s.aiMarks], notInScheme: false, comment: s.feedback, confirmed: false,
}));

export const initialState = (): State => ({
  submissions: {
    'nour-frac': { id: 'nour-frac', studentId: 'nour', examId: 'frac', status: 'due', answers: answersFrom(nourSeed), comment: '' },
    'lina-bruch': { id: 'lina-bruch', studentId: 'lina', examId: 'bruch', status: 'submitted', answers: answersFrom(linaSeed), comment: '' },
  },
  flags: [
    { id: 'f-nour', studentId: 'nour', title: 'Needs support: comparing fractions',
      detail: 'Same mistake in 3 assignments in a row: picks the smaller fraction after finding a common bottom number.',
      evidence: ['Fractions homework 1, Q4: “1/4 is bigger than 1/3”', 'Fractions homework 2, Q2: “2/5 is bigger than 1/2”', 'Fractions quiz, Q2: “3/5 is bigger than 2/3”'],
      state: 'open', note: 'Lukki has 3 short fraction games for you. Make the bottom numbers the same, then compare the top numbers.' },
    { id: 'f-omar', studentId: 'omar', title: 'Marks dropping',
      detail: 'Marks fell in the last 3 assignments (9 → 7 → 6 out of 10).',
      evidence: ['Shapes worksheet: 9/10', 'Fractions homework 2: 7/10', 'Fractions quiz (draft): 6/10'], state: 'open', note: '' },
  ],
  notifs: [
    { id: 'n0', to: 'student', text: 'Mrs Rasha posted: Fractions quiz, due Sunday', href: '/student/hand-in/', read: false },
  ],
  audit: [],
  announced: [],
  practiceDone: 0,
  memoryOn: false,
  role: 'teacher',
  photos: 0,
});

type A =
  | { type: 'submit'; id: string }
  | { type: 'checkAnswer'; id: string; qid: string; text: string; unreadable: boolean; by: Actor }
  | { type: 'finishCheck'; id: string; by: Actor }
  | { type: 'setMark'; id: string; qid: string; step: number; value: number }
  | { type: 'setComment'; id: string; qid: string; text: string }
  | { type: 'setGeneral'; id: string; text: string }
  | { type: 'notInScheme'; id: string; qid: string }
  | { type: 'confirmAnswer'; id: string; qid: string; by: Actor }
  | { type: 'confirmSub'; id: string; by: Actor }
  | { type: 'flag'; fid: string; state: 'confirmed' | 'dismissed'; note: string }
  | { type: 'announce'; text: string }
  | { type: 'release'; ids: string[] }
  | { type: 'memory'; on: boolean }
  | { type: 'role'; role: 'teacher' | 'assistant' }
  | { type: 'practice' }
  | { type: 'read'; to: 'student' | 'parent' }
  | { type: 'reset' }
  | { type: 'load'; state: State };

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const log = (s: State, actor: Actor, text: string): AuditEvent[] => [{ t: now(), actor, text }, ...s.audit];
const who = (a: Actor) => (a === 'assistant' ? 'Hatem (assistant)' : a === 'teacher' ? 'Mrs Rasha' : a === 'student' ? 'Nour' : a);

function upd(s: State, id: string, f: (x: Submission) => Submission): State {
  return { ...s, submissions: { ...s.submissions, [id]: f(s.submissions[id]) } };
}
function updAns(s: State, id: string, qid: string, f: (a: AnswerState) => AnswerState): State {
  return upd(s, id, (x) => ({ ...x, answers: x.answers.map((a) => (a.qid === qid ? f(a) : a)) }));
}
const examOf = (s: State, id: string) => exams[s.submissions[id].examId];

function reducer(s: State, a: A): State {
  switch (a.type) {
    case 'submit': {
      const n = upd(s, a.id, (x) => ({ ...x, status: 'submitted' }));
      return { ...n, audit: log(s, 'student', `Nour handed in ${examOf(s, a.id).title} (2 pages, blur check passed)`) };
    }
    case 'checkAnswer': {
      const n = updAns(s, a.id, a.qid, (x) => ({ ...x, text: a.text, unreadable: a.unreadable, checked: true,
        marks: a.unreadable ? x.marks.map(() => 0) : x.marks }));
      const changed = s.submissions[a.id].answers.find((x) => x.qid === a.qid)?.ocr !== a.text;
      return { ...n, audit: log(s, a.by, `${who(a.by)} ${a.unreadable ? 'marked unreadable' : changed ? 'corrected the text of' : 'confirmed the text of'} ${a.qid.toUpperCase()}`) };
    }
    case 'finishCheck': {
      const n = upd(s, a.id, (x) => ({ ...x, status: 'checked' }));
      return { ...n, audit: log(s, a.by, `${who(a.by)} finished the text check; AI suggested marks`) };
    }
    case 'setMark':
      return updAns(s, a.id, a.qid, (x) => ({ ...x, marks: x.marks.map((m, i) => (i === a.step ? a.value : m)), confirmed: false }));
    case 'setComment':
      return updAns(s, a.id, a.qid, (x) => ({ ...x, comment: a.text }));
    case 'setGeneral':
      return upd(s, a.id, (x) => ({ ...x, comment: a.text }));
    case 'notInScheme': {
      const n = updAns(s, a.id, a.qid, (x) => ({ ...x, notInScheme: !x.notInScheme }));
      return { ...n, audit: log(s, 'teacher', `${a.qid.toUpperCase()} sent to teacher judgement (not in the mark scheme)`) };
    }
    case 'confirmAnswer': {
      const n = updAns(s, a.id, a.qid, (x) => ({ ...x, confirmed: a.by === 'teacher' }));
      const ans = s.submissions[a.id].answers.find((x) => x.qid === a.qid)!;
      const changed = ans.marks.join() !== ans.aiMarks.join();
      return { ...n, audit: log(s, a.by, `${who(a.by)} ${a.by === 'teacher' ? (changed ? 'overrode' : 'confirmed') : 'drafted'} ${a.qid.toUpperCase()}: ${ans.marks.reduce((p, c) => p + c, 0)} mark(s)`) };
    }
    case 'confirmSub': {
      const st: Status = a.by === 'teacher' ? 'confirmed' : 'drafted';
      const n = upd(s, a.id, (x) => ({ ...x, status: st, draftedBy: a.by, answers: x.answers.map((q) => ({ ...q, confirmed: a.by === 'teacher' })) }));
      return { ...n, audit: log(s, a.by, a.by === 'teacher' ? `Mrs Rasha confirmed all grades for ${examOf(s, a.id).title}` : `Hatem sent draft grades to Mrs Rasha for sign-off`) };
    }
    case 'flag': {
      const f = s.flags.find((x) => x.id === a.fid)!;
      const flags = s.flags.map((x) => (x.id === a.fid ? { ...x, state: a.state, note: a.note } : x));
      const notifs = a.state === 'confirmed' && f.studentId === 'nour'
        ? [{ id: 'n-flag', to: 'student' as const, text: 'Mrs Rasha recommends practice: comparing fractions', href: '/student/practice/', read: false }, ...s.notifs]
        : s.notifs;
      return { ...s, flags, notifs, audit: log(s, 'teacher', `Mrs Rasha ${a.state} the red flag “${f.title}”`) };
    }
    case 'announce':
      return { ...s, announced: [...s.announced, a.text], audit: log(s, 'teacher', `Mrs Rasha announced to the class: “${a.text}”`) };
    case 'release': {
      let n = s;
      for (const id of a.ids) n = upd(n, id, (x) => ({ ...x, status: 'released' }));
      const notifs: Notif[] = a.ids.includes('nour-frac') ? [
        { id: 'n-res', to: 'student', text: 'Your Fractions quiz is back. Lukki has feedback for you!', href: '/student/results/', read: false },
        { id: 'n-par', to: 'parent', text: 'Mrs Rasha confirmed Nour’s Fractions quiz', href: '/parent/', read: false }, ...s.notifs] : s.notifs;
      return { ...n, notifs, audit: log(s, 'teacher', `Mrs Rasha released ${a.ids.length} result(s) to students and parents`) };
    }
    case 'memory':
      return { ...s, memoryOn: a.on, audit: log(s, s.role, `${who(s.role)} switched history ${a.on ? 'on' : 'off'}`) };
    case 'role':
      return { ...s, role: a.role };
    case 'practice':
      return { ...s, practiceDone: s.practiceDone + 1 };
    case 'read':
      return { ...s, notifs: s.notifs.map((x) => (x.to === a.to ? { ...x, read: true } : x)) };
    case 'reset':
      return initialState();
    case 'load':
      return a.state;
  }
}

const KEY = 'ilovetests-demo-v1';
const Ctx = createContext<{ s: State; d: (a: A) => void; ready: boolean } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, undefined, initialState);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) d({ type: 'load', state: { ...initialState(), ...JSON.parse(raw) } }); } catch { /* private mode */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } } }, [s, ready]);
  return <Ctx.Provider value={{ s, d, ready }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore outside provider');
  return c;
}

export const total = (sub: Submission) => sub.answers.reduce((p, a) => p + a.marks.reduce((x, y) => x + y, 0), 0);
export const maxOf = (examId: string) => exams[examId].questions.reduce((p, q) => p + q.steps.reduce((x, y) => x + y.marks, 0), 0);
