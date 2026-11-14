'use client';
import { useEffect } from 'react';
import { ParentShell, LukkiSays } from '@/components/Shells';
import { Card, Label, Chip } from '@/components/ui';
import { useStore, total, maxOf } from '@/lib/store';
import { nourHistory } from '@/lib/data';

export default function Parent() {
  const { s, d, ready } = useStore();
  const sub = s.submissions['nour-frac'];
  const released = sub.status === 'released';
  const flag = s.flags.find((f) => f.id === 'f-nour')!;
  useEffect(() => { if (ready) d({ type: 'read', to: 'parent' }); }, [ready, d]);
  const rows = [...nourHistory.map((h) => h.score), ...(released ? [Math.round((total(sub) / maxOf('frac')) * 100)] : [])];

  return (
    <ParentShell>
      <div className="space-y-4">
        <div>
          <Label>Weekly digest · week of 15 November</Label>
          <h1 className="font-display text-2xl">Nour’s week</h1>
        </div>
        <LukkiSays mood="wave">{released ? 'Nour handed in her Fractions quiz on time. Here is what Mrs Rasha confirmed.' : 'Nothing new yet. You only see results after Mrs Rasha confirms them.'}</LukkiSays>
        {released && (
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <div><div className="font-semibold">Fractions quiz</div><div className="text-xs text-muted">Maths · Year 4B · checked by Mrs Rasha</div></div>
              <div className="ml-auto font-display text-3xl tabular-nums">{total(sub)}<span className="text-muted text-xl"> / {maxOf('frac')}</span></div>
            </div>
            <div className="mt-3 text-sm space-y-1">
              <div><Chip tone="sky">Strong</Chip> Adding and simplifying fractions</div>
              <div><Chip tone="line">Working on</Chip> Comparing fractions</div>
            </div>
            {sub.comment && <p className="mt-3 text-sm rounded-xl bg-ice p-3">Mrs Rasha: “{sub.comment}”</p>}
          </Card>
        )}
        {released && flag.state === 'confirmed' && (
          <Card className="p-5 bg-tint border-sky">
            <Label>How you can help at home</Label>
            <p className="text-sm">{flag.note}</p>
            <p className="text-xs text-muted mt-2">Practice inside iLoveTests is never marked. {s.practiceDone > 0 ? 'Nour has already done a practice round this week.' : ''}</p>
          </Card>
        )}
        <Card className="p-5">
          <Label>This term</Label>
          <div className="flex items-end gap-2 h-24" role="img" aria-label="Nour's results this term">
            {rows.map((p, i) => <div key={i} className="flex-1 bg-sky rounded-t" style={{ height: `${p}%` }} />)}
          </div>
          <p className="text-xs text-muted mt-2">Steady progress since September.</p>
        </Card>
        <p className="text-xs text-muted text-center">Parents only see results after Mrs Rasha releases them. In this demo the parent view has no sign-in, so it shows how the page would look.</p>
      </div>
    </ParentShell>
  );
}
