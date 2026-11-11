'use client';
import { StudentShell, LukkiSays } from '@/components/Shells';
import { Card, Label } from '@/components/ui';
import { useStore, total, maxOf } from '@/lib/store';
import { nourHistory } from '@/lib/data';

export default function Progress() {
  const { s } = useStore();
  const sub = s.submissions['nour-frac'];
  const rows = [...nourHistory.map((h) => ({ name: h.exam, date: h.date, pct: h.score }))];
  if (sub.status === 'released') rows.push({ name: 'Fractions quiz', date: 'Nov', pct: Math.round((total(sub) / maxOf('frac')) * 100) });
  return (
    <StudentShell title="My progress">
      <div className="space-y-4 pt-1">
        <LukkiSays>Every exam you hand in adds a step to your path.</LukkiSays>
        <Card className="p-4">
          <Label>My exams this year</Label>
          <div className="flex items-end gap-3 h-40 mt-3" role="img" aria-label="Bar chart of exam results">
            {rows.map((r) => (
              <div key={r.name} className="flex-1 h-full flex flex-col items-center justify-end gap-1">
                <span className="text-xs font-semibold">{r.pct}%</span>
                <div className="w-full rounded-t-lg bg-sky" style={{ height: `${r.pct * 0.8}%` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2">{rows.map((r) => <div key={r.name} className="flex-1 text-[10px] text-center text-muted leading-tight">{r.name}<br />{r.date}</div>)}</div>
        </Card>
        <Card className="p-4 text-sm">
          <Label>Getting stronger</Label>
          <ul className="space-y-1.5">
            <li>✓ Adding fractions: always right</li>
            <li>✓ Simplifying fractions: right this time</li>
            <li>★ Comparing fractions: your next goal</li>
          </ul>
        </Card>
      </div>
    </StudentShell>
  );
}
