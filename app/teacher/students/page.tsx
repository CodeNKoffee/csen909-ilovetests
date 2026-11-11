'use client';
import { useState } from 'react';
import { TeacherShell } from '@/components/Shells';
import { Btn, Card, Chip, Label } from '@/components/ui';
import { useStore, total, maxOf, type Flag } from '@/lib/store';
import { students, nourHistory, classMistakes, conceptLinks } from '@/lib/data';

function FlagCard({ f }: { f: Flag }) {
  const { s, d } = useStore();
  const [note, setNote] = useState(f.note || 'Let’s look at this together in class this week.');
  const teacher = s.role === 'teacher';
  const st = students.find((x) => x.id === f.studentId)!;
  return (
    <Card className={`p-5 ${f.state === 'open' ? 'border-2 border-azure' : ''}`}>
      <div className="flex items-center gap-2">
        <Chip tone={f.state === 'open' ? 'navy' : 'line'}>{f.state === 'open' ? 'Red flag · open' : f.state === 'confirmed' ? 'Confirmed' : 'Dismissed'}</Chip>
        <span className="font-semibold">{st.name}</span>
      </div>
      <div className="font-display text-lg mt-2">{f.title}</div>
      <p className="text-sm text-muted">{f.detail}</p>
      <Label>Evidence</Label>
      <ul className="text-sm list-disc pl-5 space-y-0.5">{f.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
      {f.state === 'open' ? (
        <>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted mt-3" htmlFor={`n-${f.id}`}>Note {st.name.split(' ')[0]} and the family will see (kind wording)</label>
          <textarea id={`n-${f.id}`} value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full border border-rule rounded-xl px-3 py-2 text-sm min-h-16" />
          <div className="flex gap-2 mt-3">
            <Btn disabled={!teacher} onClick={() => d({ type: 'flag', fid: f.id, state: 'confirmed', note })}>Confirm and send practice</Btn>
            <Btn kind="ghost" disabled={!teacher} onClick={() => d({ type: 'flag', fid: f.id, state: 'dismissed', note: '' })}>Dismiss</Btn>
          </div>
          {!teacher && <p className="text-xs text-muted mt-2">Only Mrs Rasha can confirm or dismiss red flags.</p>}
          <p className="text-[11px] text-muted mt-2">The words “red flag” are only shown to teachers. Children see a kind practice note.</p>
        </>
      ) : f.note ? <p className="text-sm mt-3 rounded-xl bg-tint p-3">Sent: “{f.note}”</p> : null}
    </Card>
  );
}

export default function Students() {
  const { s, d } = useStore();
  const [sel, setSel] = useState<'flags' | 'timeline' | 'class'>('flags');
  const teacher = s.role === 'teacher';
  const msg = 'Remember: make the bottom numbers the same before you compare fractions.';
  const tabs = [['flags', 'Red flags'], ['timeline', 'Nour · Learning Timeline'], ['class', 'Class-wide mistakes']] as const;

  return (
    <TeacherShell title="Students">
      <div role="tablist" className="flex gap-1 bg-white border border-rule rounded-xl p-1 w-fit mb-5">
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={sel === k} onClick={() => setSel(k)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${sel === k ? 'bg-navy text-white' : 'text-muted hover:bg-ice'}`}>{l}</button>
        ))}
      </div>

      {sel === 'flags' && (
        <div className="grid md:grid-cols-2 gap-4">
          {s.flags.map((f) => <FlagCard key={f.id} f={f} />)}
          <Card className="p-5 md:col-span-2">
            <Label>Repeating mistakes (not yet a flag)</Label>
            <ul className="text-sm space-y-1">
              <li><b>Laila Mostafa</b> · leaves out working steps (2 assignments)</li>
              <li><b>Adam Fawzy</b> · mixes up × and + in word problems (2 assignments)</li>
            </ul>
          </Card>
        </div>
      )}

      {sel === 'timeline' && (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
          <Card className="p-5">
            <Label>Learning Timeline · Nour Khaled</Label>
            <ol className="relative border-l-2 border-rule ml-2 mt-3 space-y-5">
              {[...nourHistory, { exam: 'Fractions quiz', date: 'Nov', score: ['confirmed', 'released'].includes(s.submissions['nour-frac'].status) ? Math.round((total(s.submissions['nour-frac']) / maxOf('frac')) * 100) : 0, concepts: { 'Comparing fractions': 50 } }].map((h, i) => {
                const weak = Object.entries(h.concepts).some(([, v]) => v < 60);
                return (
                  <li key={i} className="pl-5 relative">
                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${weak ? 'bg-navy' : 'bg-sky'}`} />
                    <div className="text-xs text-muted">{h.date}</div>
                    <div className="font-semibold">{h.exam}{h.score ? ` · ${h.score}%` : ' · not confirmed yet'}</div>
                    <div className="text-sm text-muted">{Object.keys(h.concepts).join(', ')}{weak && <span className="text-navy font-semibold"> · gap</span>}</div>
                  </li>
                );
              })}
            </ol>
          </Card>
          <Card className="p-5">
            <Label>Concept Links</Label>
            <p className="text-sm text-muted mb-3">Where comparing fractions shows up next.</p>
            <ul className="space-y-2">
              {conceptLinks.map((c) => (
                <li key={c.to} className="flex items-center gap-2 text-sm">
                  <Chip tone="navy">{c.from}</Chip><span aria-hidden>→</span><Chip tone="tint">{c.to}</Chip><span className="text-muted text-xs">{c.subject}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {sel === 'class' && (
        <Card className="p-5 max-w-2xl">
          <Label>Fractions quiz · Year 4B · mistakes across the class</Label>
          <ul className="space-y-3 mt-2">
            {classMistakes.map((m) => (
              <li key={m.label}>
                <div className="flex text-sm"><span>{m.label}</span><span className="ml-auto font-semibold tabular-nums">{m.pct}%</span></div>
                <div className="h-2.5 rounded-full bg-tint mt-1"><div className="h-full rounded-full bg-azure" style={{ width: `${m.pct}%` }} /></div>
              </li>
            ))}
          </ul>
          <Label>Announcement to the class</Label>
          <div className="rounded-xl bg-ice p-3 text-sm">{msg}</div>
          <Btn className="mt-3" disabled={!teacher || s.announced.includes(msg)} onClick={() => d({ type: 'announce', text: msg })}>
            {s.announced.includes(msg) ? '✓ Announced' : 'Announce to Year 4B'}
          </Btn>
          <p className="text-xs text-muted mt-2">No names are shown. Pupils see this as a class note on their home screen.</p>
        </Card>
      )}
    </TeacherShell>
  );
}
