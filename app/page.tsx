'use client';
import Link from 'next/link';
import Lukki from '@/components/Lukki';
import { Wordmark } from '@/components/ui';

const views = [
  { href: '/student/', who: 'Nour, Grade 4', title: 'Student view', text: 'Hand in an exam by photo, then read Lukki’s kind feedback once the teacher confirms it.', tone: 'bg-sky' },
  { href: '/teacher/', who: 'Mrs Rasha, teacher', title: 'Teacher view', text: 'Check what the AI read, confirm or override grades, review gaps and red flags, then release.', tone: 'bg-navy text-white' },
  { href: '/parent/', who: 'Nour’s family', title: 'Parent view (bonus)', text: 'A weekly digest of teacher-confirmed results only, never unchecked AI output.', tone: 'bg-tint' },
];
const flow = ['Student uploads', 'AI reads (OCR)', 'Teacher checks text', 'AI suggests grades', 'Teacher confirms', 'Gaps & red flags', 'Feedback released', 'Student & parent view'];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between"><Wordmark size="text-3xl" /><span className="text-xs text-muted">CSEN 909 · Phase 3 prototype</span></div>
        <section className="mt-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">Find the gaps.<br />Close the gaps.</h1>
            <p className="mt-5 text-lg text-muted max-w-xl">AI-assisted exam marking and learning-gap detection for Grades 1–5. The AI reads, grades and flags; <b className="text-navy">the teacher confirms every step</b>; the child sees kind, specific feedback from Lukki.</p>
          </div>
          <Lukki size={200} mood="wave" className="bob mx-auto" />
        </section>

        <h2 className="mt-14 mb-4 font-semibold text-muted uppercase tracking-wider text-xs">Open a view</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {views.map((v) => (
            <Link key={v.href} href={v.href} className={`${v.tone} rounded-3xl p-6 hover:-translate-y-0.5 transition shadow-sm`}>
              <div className="text-xs font-semibold opacity-80">{v.who}</div>
              <div className="font-display text-2xl mt-1">{v.title}</div>
              <p className="mt-2 text-sm opacity-90">{v.text}</p>
              <div className="mt-4 text-sm font-semibold">Open →</div>
            </Link>
          ))}
        </div>

        <h2 className="mt-14 mb-4 font-semibold text-muted uppercase tracking-wider text-xs">The workflow this prototype covers</h2>
        <ol className="flex flex-wrap gap-2">
          {flow.map((f, i) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <span className="bg-white border border-rule rounded-full px-3 py-1.5"><b className="text-azure mr-1">{i + 1}</b>{f}</span>
              {i < flow.length - 1 && <span className="text-sky" aria-hidden>→</span>}
            </li>
          ))}
        </ol>
        <p className="mt-10 text-xs text-muted max-w-2xl">Prototype for GUC CSEN 909 Human Computer Interaction, Winter 2026, by Team iLoveTests. All AI output (text reading, grades, flags) is simulated with fixed data, as the brief allows. Progress is saved in this browser; use “Reset demo” in the guide to start again.</p>
      </div>
    </main>
  );
}
