'use client';
import Link from 'next/link';
import { TeacherShell } from '@/components/Shells';
import { Card, Label, LinkBtn, Chip, Bar } from '@/components/ui';
import { useStore, total, maxOf, type Status } from '@/lib/store';
import { classBatch, students } from '@/lib/data';
import { statusText } from '@/lib/labels';


export default function TeacherHome() {
  const { s } = useStore();
  const nour = s.submissions['nour-frac'];
  const lina = s.submissions['lina-bruch'];
  const rows = [
    { id: 'nour', status: nour.status, score: total(nour), live: true },
    ...classBatch.map((b) => ({ id: b.id, status: b.status as Status, score: b.score, live: false })),
  ];
  const n = (st: Status[]) => rows.filter((r) => st.includes(r.status)).length;
  const pct = Math.round((n(['confirmed', 'released']) / rows.length) * 100);
  const openFlags = s.flags.filter((f) => f.state === 'open').length;
  const next = nour.status === 'submitted' ? { href: '/teacher/check/?sub=nour-frac', label: 'Check Nour’s text' }
    : ['checked', 'drafted'].includes(nour.status) ? { href: '/teacher/grade/?sub=nour-frac', label: 'Grade Nour’s quiz' }
    : nour.status === 'confirmed' ? { href: '/teacher/release/', label: 'Release results' } : null;

  return (
    <TeacherShell title="Good morning, Mrs Rasha">
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div>
                <Label>This week · due Sunday</Label>
                <div className="font-display text-xl">Fractions quiz · Year 4B</div>
                <div className="text-sm text-muted">{rows.length - n(['due'])} of {rows.length} handed in · {n(['submitted'])} to check · {n(['checked', 'drafted'])} to grade</div>
              </div>
              {next && <LinkBtn href={next.href} className="ml-auto">{next.label}</LinkBtn>}
            </div>
            <div className="mt-4"><Bar pct={pct} label="Batch confirmed" /></div>
            <div className="text-xs text-muted mt-1">{pct}% confirmed</div>
            <table className="w-full mt-4 text-sm">
              <thead><tr className="text-left text-muted text-xs"><th className="py-2 font-semibold">Student</th><th className="font-semibold">Status</th><th className="font-semibold text-right">Score</th></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const st = students.find((x) => x.id === r.id)!;
                  return (
                    <tr key={r.id} className={`border-t border-rule ${r.live ? 'bg-tint/50' : ''}`}>
                      <td className="py-2.5 font-semibold">{st.name}{r.live && <span className="ml-2 text-[11px] text-azure">live demo</span>}</td>
                      <td><Chip tone={r.status === 'confirmed' || r.status === 'released' ? 'sky' : r.status === 'due' ? 'line' : 'tint'}>{statusText[r.status]}</Chip></td>
                      <td className="text-right tabular-nums">{['drafted', 'confirmed', 'released'].includes(r.status) ? `${r.score} / ${maxOf('frac')}` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <Card className="p-5 flex items-center gap-3">
            <div>
              <Label>Klasse 4 (Deutsch) · German exam</Label>
              <div className="font-display text-lg">Mathe-Test: Brüche</div>
              <div className="text-sm text-muted">Lina Becker · {statusText[lina.status]}</div>
            </div>
            {lina.status === 'submitted' && <LinkBtn href="/teacher/check/?sub=lina-bruch" kind="ghost" className="ml-auto">Check text (Deutsch)</LinkBtn>}
            {['checked', 'drafted'].includes(lina.status) && <LinkBtn href="/teacher/grade/?sub=lina-bruch" kind="ghost" className="ml-auto">Grade</LinkBtn>}
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <Label>Needs your attention</Label>
            <ul className="text-sm space-y-2">
              <li>{openFlags} red flag(s) to confirm or dismiss</li>
              <li>2 pupils with repeating mistakes</li>
              <li>{n(['drafted'])} draft(s) from Hatem to sign off</li>
            </ul>
            <LinkBtn href="/teacher/students/" kind="soft" className="w-full mt-3">Open Students</LinkBtn>
          </Card>
          <Card className="p-5">
            <Label>Assistants</Label>
            <div className="text-sm">Hatem Soliman · drafted 2 of this batch</div>
            <p className="text-xs text-muted mt-2">Assistants prepare text checks and draft grades. Only you confirm grades, decide on red flags and release results.</p>
          </Card>
          <Card className="p-5 text-sm">
            <Label>Shortcuts</Label>
            <Link href="/teacher/audit/" className="underline">See every decision in the audit trail</Link>
          </Card>
        </div>
      </div>
    </TeacherShell>
  );
}
