'use client';
import { useEffect, useState } from 'react';
import { StudentShell, LukkiSays } from '@/components/Shells';
import { Card, Label, LinkBtn, Chip } from '@/components/ui';
import { useStore, total, maxOf } from '@/lib/store';
import { exams } from '@/lib/data';

export default function Results() {
  const { s, d, ready } = useStore();
  const sub = s.submissions['nour-frac'];
  const released = sub.status === 'released';
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { if (ready && released) d({ type: 'read', to: 'student' }); }, [ready, released, d]);
  const flag = s.flags.find((f) => f.id === 'f-nour')!;
  const exam = exams.frac;

  if (!released) {
    return (
      <StudentShell title="My results">
        <div className="pt-4 space-y-4">
          <LukkiSays mood="think">Your Fractions quiz isn’t back yet. Mrs Rasha checks every answer before you see it.</LukkiSays>
          <LinkBtn href="/student/" kind="soft" className="w-full">Back home</LinkBtn>
        </div>
      </StudentShell>
    );
  }
  const right = sub.answers.filter((a, i) => a.marks.reduce((x, y) => x + y, 0) === exam.questions[i].steps.reduce((x, y) => x + y.marks, 0)).length;

  return (
    <StudentShell title="Fractions quiz">
      <div className="space-y-4 pt-1">
        <LukkiSays mood="cheer">Great effort, Nour! You got <b>{right} of 5</b> questions fully right. Your adding and simplifying are super strong.</LukkiSays>

        <Card className="p-5 text-center">
          <Label>Your score</Label>
          <div className="font-display text-5xl">{total(sub)} <span className="text-muted text-3xl">/ {maxOf('frac')}</span></div>
          <div className="text-sm text-muted mt-1">Checked by Mrs Rasha</div>
        </Card>

        <Label>Question by question</Label>
        <div className="space-y-2">
          {sub.answers.map((a, i) => {
            const q = exam.questions[i];
            const got = a.marks.reduce((x, y) => x + y, 0);
            const max = q.steps.reduce((x, y) => x + y.marks, 0);
            const full = got === max;
            return (
              <Card key={a.qid} className="p-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Q{q.n}</span><span className="text-sm text-muted truncate">{q.prompt}</span>
                  <Chip tone={full ? 'sky' : 'line'} className="ml-auto shrink-0">{full ? '✓ Got it' : 'Not yet'}</Chip>
                </div>
                {!full && (
                  <>
                    <p className="text-sm mt-2">{a.comment}</p>
                    <button className="text-sm font-semibold underline mt-1" onClick={() => setOpen(open === a.qid ? null : a.qid)} aria-expanded={open === a.qid}>How to fix it →</button>
                    {open === a.qid && <div className="mt-2 rounded-xl bg-tint p-3 text-sm pop">Mark scheme: {q.answer}</div>}
                  </>
                )}
              </Card>
            );
          })}
        </div>

        {sub.comment && (
          <Card className="p-4"><Label>Mrs Rasha says</Label><p className="text-sm">{sub.comment}</p></Card>
        )}
        {flag.state === 'confirmed' && (
          <Card className="p-4 bg-tint border-sky">
            <Label>Practice for you</Label>
            <p className="text-sm">{flag.note}</p>
            <LinkBtn href="/student/practice/" big className="w-full mt-3">Practise comparing fractions (no marks)</LinkBtn>
          </Card>
        )}
      </div>
    </StudentShell>
  );
}
