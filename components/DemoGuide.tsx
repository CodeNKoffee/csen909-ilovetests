'use client';
// Floating guide that walks a TA through the full workflow across all views.
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function DemoGuide() {
  const { s, d } = useStore();
  const [open, setOpen] = useState(false);
  const [sure, setSure] = useState(false);
  const nour = s.submissions['nour-frac'];
  const order = ['due', 'submitted', 'checked', 'drafted', 'confirmed', 'released'];
  const at = (st: string) => order.indexOf(nour.status) >= order.indexOf(st);
  const flag = s.flags.find((f) => f.id === 'f-nour')!;
  const steps = [
    { done: at('submitted'), label: 'Nour hands in her Fractions quiz', href: '/student/hand-in/', who: 'Student' },
    { done: at('checked'), label: 'Mrs Rasha checks the text the AI read', href: '/teacher/check/?sub=nour-frac', who: 'Teacher' },
    { done: at('confirmed'), label: 'AI suggests grades; the teacher confirms or overrides', href: '/teacher/grade/?sub=nour-frac', who: 'Teacher' },
    { done: flag.state !== 'open', label: 'Review the learning gap and the red flag', href: '/teacher/students/', who: 'Teacher' },
    { done: at('released'), label: 'Release results to Nour and her parents', href: '/teacher/release/', who: 'Teacher' },
    { done: at('released') && s.notifs.some((n) => n.id === 'n-res' && n.read), label: 'Nour reads Lukki’s feedback', href: '/student/results/', who: 'Student' },
    { done: s.practiceDone > 0, label: 'Nour practises comparing fractions', href: '/student/practice/', who: 'Student' },
    { done: s.notifs.some((n) => n.id === 'n-par' && n.read), label: 'Her parent reads the weekly digest', href: '/parent/', who: 'Parent' },
  ];
  const next = steps.findIndex((x) => !x.done);
  const doneCount = steps.filter((x) => x.done).length;

  const cur = steps[next];
  return (
    <>
    {cur && (
      <Link href={cur.href} className="md:hidden fixed right-3 bottom-24 z-50 bg-navy text-white rounded-full pl-3 pr-4 py-2 text-xs font-semibold shadow-lg" data-demo-guide>
        Demo {doneCount}/{steps.length} · next →
      </Link>
    )}
    <aside className="hidden md:block fixed bottom-4 right-4 z-50 w-[290px] bg-white rounded-2xl border border-rule shadow-xl text-sm" aria-label="Demo guide" data-demo-guide>
      <div className="flex items-center gap-2 px-4 pt-3">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted">Demo guide · {doneCount}/{steps.length}</span>
        <button onClick={() => setOpen(!open)} className="ml-auto text-xs font-semibold underline" aria-expanded={open}>{open ? 'Hide steps' : 'All steps'}</button>
      </div>
      <div className="mx-4 mt-2 h-1.5 rounded-full bg-tint"><div className="h-full rounded-full bg-azure" style={{ width: `${(doneCount / steps.length) * 100}%` }} /></div>
      {open && (
        <ol className="px-3 pt-2 space-y-0.5 max-h-[45vh] overflow-y-auto">
          {steps.map((x, i) => (
            <li key={i}>
              <Link href={x.href} className={`flex gap-2 items-start rounded-lg px-2 py-1 ${i === next ? 'bg-tint' : 'hover:bg-ice'}`}>
                <span className={`mt-0.5 w-5 h-5 shrink-0 rounded-full grid place-items-center text-[11px] font-bold ${x.done ? 'bg-azure text-white' : 'border border-rule text-muted'}`}>{x.done ? '✓' : i + 1}</span>
                <span className={x.done ? 'text-muted line-through' : ''}>{x.label} <span className="text-[11px] text-muted">· {x.who}</span></span>
              </Link>
            </li>
          ))}
        </ol>
      )}
      <div className="px-4 py-2.5">
        {cur ? (
          <Link href={cur.href} className="flex items-center gap-2 rounded-xl bg-navy text-white px-3 py-2 font-semibold">
            <span className="text-[11px] bg-white/20 rounded-full px-2">{next + 1}</span><span className="flex-1 leading-tight">{cur.label}</span><span aria-hidden>→</span>
          </Link>
        ) : <div className="rounded-xl bg-tint px-3 py-2 font-semibold">All 8 steps done. That is the full loop.</div>}
      </div>
      <div className="flex items-center gap-2 px-4 pb-2.5 text-[11px] text-muted">
        <span>All AI output is simulated.</span>
        {sure
          ? <span className="ml-auto flex gap-2"><button className="underline font-semibold text-navy" onClick={() => { d({ type: 'reset' }); setSure(false); }}>Yes, reset</button><button className="underline" onClick={() => setSure(false)}>Cancel</button></span>
          : <button onClick={() => setSure(true)} className="ml-auto underline">Reset demo</button>}
      </div>
    </aside>
    </>
  );
}
