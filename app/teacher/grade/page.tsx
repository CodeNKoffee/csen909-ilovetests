'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TeacherShell } from '@/components/Shells';
import { Btn, Card, Chip, Label, Bar } from '@/components/ui';
import Scan from '@/components/Scan';
import { useStore, total, maxOf, type AnswerState } from '@/lib/store';
import { exams, students, nourHistory } from '@/lib/data';
import { statusText } from '@/lib/labels';

const sum = (a: number[]) => a.reduce((p, c) => p + c, 0);

function Queue() {
  const { s } = useStore();
  const subs = Object.values(s.submissions);
  return (
    <TeacherShell title="Grade">
      <p className="text-sm text-muted mb-4">The AI suggests marks from the mark scheme. Every mark is confirmed by Mrs Rasha.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {subs.map((x) => (
          <Card key={x.id} className="p-5">
            <Label>{exams[x.examId].className}</Label>
            <div className="font-display text-lg">{students.find((t) => t.id === x.studentId)!.name}</div>
            <div className="text-sm text-muted">{exams[x.examId].title} · {statusText[x.status]}</div>
            {['checked', 'drafted'].includes(x.status) && <Link href={`/teacher/grade/?sub=${x.id}`} className="inline-block mt-3 bg-navy text-white rounded-xl px-4 py-2 text-sm font-semibold">Open grading</Link>}
            {x.status === 'submitted' && <Link href={`/teacher/check/?sub=${x.id}`} className="inline-block mt-3 underline text-sm">Check the text first</Link>}
          </Card>
        ))}
      </div>
    </TeacherShell>
  );
}

function MemoryCompare({ a }: { a: AnswerState }) {
  const blind = sum(a.aiMarks);
  const hist = sum(a.aiMarksHistory ?? a.aiMarks);
  return (
    <div className="grid grid-cols-2 gap-2 mt-3 text-xs pop">
      <div className="rounded-xl border border-rule p-3">
        <div className="font-semibold text-muted">Without history</div>
        <div className="font-display text-lg">{blind} mark(s)</div>
        <div className="text-muted">{a.reason}</div>
      </div>
      <div className="rounded-xl border-2 border-azure p-3 bg-cream">
        <div className="font-semibold text-azure">With history</div>
        <div className="font-display text-lg">{hist} mark(s)</div>
        <div className="text-muted">{a.hint ?? 'No pattern in earlier work.'}</div>
      </div>
      <p className="col-span-2 text-muted">History adds context for feedback. It never changes the marks.</p>
    </div>
  );
}

function AnswerCard({ id, a, active, onOpen }: { id: string; a: AnswerState; active: boolean; onOpen: () => void }) {
  const { s, d } = useStore();
  const sub = s.submissions[id];
  const exam = exams[sub.examId];
  const q = exam.questions.find((x) => x.id === a.qid)!;
  const max = sum(q.steps.map((x) => x.marks));
  const got = sum(a.marks);
  const overridden = a.marks.join() !== a.aiMarks.join();
  const teacher = s.role === 'teacher';

  return (
    <Card className={`p-4 ${active ? 'border-2 border-azure' : ''}`}>
      <button className="w-full flex items-center gap-2 text-left" onClick={onOpen} aria-expanded={active}>
        <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold ${a.confirmed ? 'bg-azure text-white' : 'border border-rule'}`}>{a.confirmed ? '✓' : q.n}</span>
        <span className="font-semibold">Q{q.n}</span>
        <span className="text-sm text-muted truncate">{q.concept}</span>
        {a.hint && !a.confirmed && <Chip tone="navy" className="shrink-0">Second look</Chip>}
        {a.notInScheme && <Chip tone="line" className="shrink-0">Your judgement</Chip>}
        <span className="ml-auto font-display tabular-nums">{got}/{max}</span>
      </button>
      {active && (
        <div className="mt-3 pop">
          <div className="rounded-xl bg-ice p-3 font-hand text-xl text-[#1d3d8f]">{a.unreadable ? <span className="font-sans text-sm text-muted">Marked unreadable in the text check (0 marks).</span> : a.text}</div>
          {a.hint && <div className="mt-2 rounded-xl border-l-4 border-azure bg-tint px-3 py-2 text-sm"><b>Why look again:</b> {a.hint}</div>}

          <div className="mt-3">
            <Label>Mark scheme · tap to give or remove a mark</Label>
            <ul className="space-y-1.5">
              {q.steps.map((st, i) => {
                const on = a.marks[i] > 0;
                return (
                  <li key={i}>
                    <button disabled={a.unreadable} onClick={() => d({ type: 'setMark', id, qid: a.qid, step: i, value: on ? 0 : st.marks })}
                      className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2 text-sm text-left ${on ? 'border-azure bg-tint' : 'border-rule bg-white'} disabled:opacity-50`}
                      aria-pressed={on}>
                      <span className={`w-6 h-6 rounded-md grid place-items-center font-bold ${on ? 'bg-azure text-white' : 'border border-rule'}`}>{on ? '✓' : ''}</span>
                      <span className="flex-1">{st.label}</span>
                      <span className="text-xs text-muted">AI: {a.aiMarks[i]}/{st.marks}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-muted mt-2"><b>AI reason:</b> {a.reason}{overridden && <span className="text-azure font-semibold"> · You changed the AI suggestion</span>}</p>
          </div>

          {s.memoryOn && <MemoryCompare a={a} />}

          <div className="mt-3">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-muted" htmlFor={`c-${a.qid}`}>Comment for {students.find((t) => t.id === sub.studentId)!.name.split(' ')[0]} (suggested, edit freely)</label>
            <textarea id={`c-${a.qid}`} value={a.comment} onChange={(e) => d({ type: 'setComment', id, qid: a.qid, text: e.target.value })}
              className="mt-1 w-full border border-rule rounded-xl px-3 py-2 text-sm min-h-16" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Btn onClick={() => d({ type: 'confirmAnswer', id, qid: a.qid, by: s.role })}>{teacher ? (overridden ? `Confirm my marks (${got})` : `Confirm AI marks (${got})`) : 'Save as draft'}</Btn>
            <Btn kind="ghost" onClick={() => d({ type: 'notInScheme', id, qid: a.qid })}>{a.notInScheme ? 'Back to mark scheme' : 'Not in the mark scheme'}</Btn>
          </div>
        </div>
      )}
    </Card>
  );
}

function Grade({ id }: { id: string }) {
  const { s, d } = useStore();
  const router = useRouter();
  const sub = s.submissions[id];
  const exam = exams[sub.examId];
  const student = students.find((t) => t.id === sub.studentId)!;
  const firstOpen = sub.answers.find((a) => !a.confirmed && a.hint) ?? sub.answers.find((a) => !a.confirmed) ?? sub.answers[0];
  const [open, setOpen] = useState(firstOpen.qid);
  const teacher = s.role === 'teacher';
  const confirmed = sub.answers.filter((a) => a.confirmed).length;

  if (['due', 'submitted'].includes(sub.status)) {
    return <TeacherShell title="Grade"><Card className="p-6">The text for {student.name} is not checked yet. <Link className="underline" href={`/teacher/check/?sub=${id}`}>Check text first</Link>.</Card></TeacherShell>;
  }
  if (['confirmed', 'released'].includes(sub.status)) {
    return (
      <TeacherShell title={`Grade · ${student.name}`}>
        <Card className="p-6">
          <div className="font-display text-2xl">{total(sub)} / {maxOf(sub.examId)}</div>
          <div className="text-sm text-muted">Confirmed by Mrs Rasha · {statusText[sub.status]}</div>
          {sub.status === 'confirmed' && <Link href="/teacher/release/" className="inline-block mt-3 bg-navy text-white rounded-xl px-4 py-2 text-sm font-semibold">Go to Release</Link>}
        </Card>
      </TeacherShell>
    );
  }

  return (
    <TeacherShell title={`Grade · ${student.name}`} actions={
      <label className="flex items-center gap-2 text-sm font-semibold bg-white border border-rule rounded-xl px-3 py-2 cursor-pointer">
        <input type="checkbox" checked={s.memoryOn} onChange={(e) => d({ type: 'memory', on: e.target.checked })} className="accent-[#4790CD] w-4 h-4" />
        Show {student.name.split(' ')[0]}’s history
      </label>}>
      {sub.status === 'drafted' && teacher && (
        <div className="mb-4 rounded-xl bg-tint border border-sky px-4 py-3 text-sm"><b>Draft from Hatem.</b> Review each answer and confirm. Nothing reaches {student.name.split(' ')[0]} until you release it.</div>
      )}
      {!teacher && (
        <div className="mb-4 rounded-xl bg-tint border border-sky px-4 py-3 text-sm"><b>You are signed in as Hatem (assistant).</b> Your marks are saved as a draft for Mrs Rasha to confirm.</div>
      )}
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-5">
        <div className="space-y-3">
          <Label>Scan</Label>
          <Scan examId={sub.examId} answers={sub.answers} highlight={open} name={student.name} />
          {s.memoryOn && sub.studentId === 'nour' && (
            <Card className="p-4 pop">
              <Label>Nour’s history (last 4 assignments)</Label>
              <div className="flex items-end gap-2 h-20">
                {nourHistory.map((h) => <div key={h.exam} className="flex-1 bg-sky rounded-t" style={{ height: `${h.score}%` }} title={`${h.exam}: ${h.score}%`} />)}
              </div>
              <div className="text-xs text-muted mt-2">Comparing fractions: wrong in 2 earlier homeworks.</div>
            </Card>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1"><Bar pct={(confirmed / sub.answers.length) * 100} label="Answers confirmed" /></div>
            <span className="text-xs text-muted">{confirmed}/{sub.answers.length} {teacher ? 'confirmed' : 'drafted'}</span>
          </div>
          <p className="text-xs text-muted">Answers that need a second look are opened first.</p>
          {sub.answers.map((a) => <AnswerCard key={a.qid} id={id} a={a} active={open === a.qid} onOpen={() => setOpen(open === a.qid ? '' : a.qid)} />)}
          <Card className="p-4">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-muted" htmlFor="general">General comment</label>
            <textarea id="general" value={sub.comment} onChange={(e) => d({ type: 'setGeneral', id, text: e.target.value })}
              placeholder={exam.lang === 'de' ? 'Allgemeiner Kommentar…' : 'e.g. Lovely neat working, Nour. Let’s practise comparing fractions this week.'}
              className="mt-1 w-full border border-rule rounded-xl px-3 py-2 text-sm min-h-16" />
            <div className="flex items-center gap-3 mt-3">
              <div className="font-display text-2xl tabular-nums">{total(sub)} / {maxOf(sub.examId)}</div>
              <Btn className="ml-auto" onClick={() => {
                if (!sub.comment) d({ type: 'setGeneral', id, text: exam.lang === 'de' ? 'Gut gemacht! Übe das Kürzen noch einmal.' : 'Lovely neat working, Nour. Let’s practise comparing fractions this week.' });
                d({ type: 'confirmSub', id, by: s.role });
                router.push(teacher ? '/teacher/students/' : '/teacher/');
              }}>{teacher ? 'Confirm all grades' : 'Send draft to Mrs Rasha'}</Btn>
            </div>
          </Card>
        </div>
      </div>
    </TeacherShell>
  );
}

function Inner() {
  const sp = useSearchParams();
  const { s, ready } = useStore();
  const id = sp.get('sub');
  if (!ready) return null;
  if (!id || !s.submissions[id]) return <Queue />;
  return <Grade id={id} />;
}

export default function Page() {
  return <Suspense><Inner /></Suspense>;
}
