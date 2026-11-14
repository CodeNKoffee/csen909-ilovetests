'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TeacherShell } from '@/components/Shells';
import { Btn, Card, Chip, Label, Bar } from '@/components/ui';
import Scan from '@/components/Scan';
import { useStore } from '@/lib/store';
import { exams, students, type Lang } from '@/lib/data';
import { statusText } from '@/lib/labels';

function Queue() {
  const { s } = useStore();
  const subs = Object.values(s.submissions);
  return (
    <TeacherShell title="Check text">
      <p className="text-sm text-muted mb-4">Nothing is graded until the text the AI read has been checked.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {subs.map((x) => (
          <Card key={x.id} className="p-5">
            <Label>{exams[x.examId].className} · {exams[x.examId].lang === 'de' ? 'Deutsch' : 'English'}</Label>
            <div className="font-display text-lg">{students.find((t) => t.id === x.studentId)!.name}</div>
            <div className="text-sm text-muted">{exams[x.examId].title} · {statusText[x.status]}</div>
            {x.status === 'submitted' && <Link href={`/teacher/check/?sub=${x.id}`} className="inline-block mt-3 bg-navy text-white rounded-xl px-4 py-2 text-sm font-semibold">Check text</Link>}
          </Card>
        ))}
      </div>
    </TeacherShell>
  );
}

function Check({ id }: { id: string }) {
  const { s, d } = useStore();
  const router = useRouter();
  const sub = s.submissions[id];
  const exam = exams[sub.examId];
  const student = students.find((t) => t.id === sub.studentId)!;
  const order = useMemo(() => [...sub.answers].sort((a, b) => a.conf - b.conf).map((a) => a.qid), [sub.answers]);
  const pending = order.filter((q) => !sub.answers.find((a) => a.qid === q)!.checked);
  const [cur, setCur] = useState(pending[0] ?? order[0]);
  const ans = sub.answers.find((a) => a.qid === cur)!;
  const q = exam.questions.find((x) => x.id === cur)!;
  const [text, setText] = useState(ans.text);
  const [lang, setLang] = useState<Lang>(exam.lang);
  useEffect(() => { setText(ans.text); }, [cur, ans.text]);
  const de = exam.lang === 'de';

  const confirmText = (unreadable: boolean) => {
    d({ type: 'checkAnswer', id, qid: cur, text: unreadable ? '' : text, unreadable, by: s.role });
    const rest = pending.filter((x) => x !== cur);
    if (rest.length) setCur(rest[0]);
  };
  const doneCount = order.length - pending.length;
  const allDone = pending.length === 0;

  if (sub.status !== 'submitted') {
    return (
      <TeacherShell title="Check text">
        <Card className="p-6">
          <div className="font-semibold">{student.name}’s text is already checked.</div>
          <Link href={`/teacher/grade/?sub=${id}`} className="inline-block mt-3 bg-navy text-white rounded-xl px-4 py-2 text-sm font-semibold">Go to grading</Link>
        </Card>
      </TeacherShell>
    );
  }

  return (
    <TeacherShell title={`Check text · ${student.name}`} actions={<Chip tone="line">{exam.title}</Chip>}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Chip tone="tint">Least certain first</Chip>
        <Chip tone="line">Demo data: the text the AI “read” is fixed sample text, not live OCR</Chip>
        <label className="text-sm flex items-center gap-2">Exam language
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="border border-rule rounded-lg px-2 py-1 bg-white font-semibold">
            <option value="en">English</option><option value="de">Deutsch</option>
          </select>
        </label>
        <div className="ml-auto w-64">
          <Bar pct={(doneCount / order.length) * 100} label="Answers checked" />
          <div className="text-xs text-muted mt-1">{pending.length} answer(s) left · about {Math.max(1, pending.length)} min</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div>
          <Label>Scan · {student.name}</Label>
          <Scan examId={sub.examId} answers={sub.answers} highlight={allDone ? undefined : cur} name={student.name} />
        </div>
        <div className="space-y-3">
          {!allDone ? (
            <Card className="p-5 border-2 border-azure pop" key={cur}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Q{q.n} · what the AI read</span>
                <Chip tone={ans.conf < 0.6 ? 'navy' : 'tint'} className="ml-auto">AI {ans.conf < 0.3 ? 'can’t read it' : `${Math.round(ans.conf * 100)}% sure`}</Chip>
              </div>
              <p className="text-xs text-muted mt-1">{q.prompt}</p>
              <label className="block mt-3 text-xs font-semibold text-muted" htmlFor="ocr">{de ? 'Erkannter Text (bearbeitbar)' : 'Text (edit if wrong)'}</label>
              <input id="ocr" value={text} onChange={(e) => setText(e.target.value)} placeholder={ans.conf < 0.3 ? 'The AI could not read this. Type what you see on the scan.' : ''}
                className="mt-1 w-full border-2 border-dashed border-rule rounded-xl px-3 py-3 font-hand text-2xl text-[#1d3d8f] bg-cream" />
              <p className="text-xs text-muted mt-2">Highlighted on the scan ←</p>
              <div className="flex gap-2 mt-4">
                <Btn className="flex-1" disabled={!text.trim()} onClick={() => confirmText(false)}>{text === ans.ocr ? '✓ Correct, next' : '✓ Save correction, next'}</Btn>
                <Btn kind="ghost" onClick={() => confirmText(true)}>Mark unreadable</Btn>
              </div>
              <p className="text-[11px] text-muted mt-2">Unreadable answers score 0, as in IGCSE marking. The AI never guesses them.</p>
            </Card>
          ) : (
            <Card className="p-5 border-2 border-sky pop">
              <div className="font-semibold">All {order.length} answers checked.</div>
              <p className="text-sm text-muted mt-1">The AI can now suggest marks from the checked text and the mark scheme.</p>
              <Btn className="mt-4 w-full" onClick={() => { d({ type: 'finishCheck', id, by: s.role }); router.push(`/teacher/grade/?sub=${id}`); }}>Send to AI grading →</Btn>
            </Card>
          )}
          <Card className="p-4">
            <Label>Answers</Label>
            <ul className="space-y-1">
              {order.map((qid) => {
                const a = sub.answers.find((x) => x.qid === qid)!;
                const n = exam.questions.find((x) => x.id === qid)!.n;
                return (
                  <li key={qid}>
                    <button onClick={() => setCur(qid)} className={`w-full flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 ${qid === cur && !allDone ? 'bg-tint' : 'hover:bg-ice'}`}>
                      <span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold ${a.checked ? 'bg-azure text-white' : 'border border-rule'}`}>{a.checked ? '✓' : ''}</span>
                      Q{n}<span className="text-muted truncate font-hand text-base">{a.unreadable ? 'unreadable' : a.text || '…'}</span>
                      <span className="ml-auto text-xs text-muted">{Math.round(a.conf * 100)}%</span>
                    </button>
                  </li>
                );
              })}
            </ul>
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
  return <Check id={id} />;
}

export default function Page() {
  return <Suspense><Inner /></Suspense>;
}
