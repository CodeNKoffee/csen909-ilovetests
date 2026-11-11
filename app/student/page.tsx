'use client';
import Link from 'next/link';
import { StudentShell, LukkiSays } from '@/components/Shells';
import { Card, LinkBtn, Label, Chip } from '@/components/ui';
import { useStore } from '@/lib/store';
import { gapPath } from '@/lib/data';

export default function StudentHome() {
  const { s } = useStore();
  const sub = s.submissions['nour-frac'];
  const notifs = s.notifs.filter((n) => n.to === 'student');
  const waiting = ['submitted', 'checked', 'drafted', 'confirmed'].includes(sub.status);
  const flag = s.flags.find((f) => f.id === 'f-nour')!;

  return (
    <StudentShell>
      <div className="mt-2 mb-5">
        {sub.status === 'due' && <LukkiSays mood="wave">Hi Nour! You have <b>1 thing</b> to hand in today.</LukkiSays>}
        {waiting && <LukkiSays mood="think">Great job handing it in! Mrs Rasha is checking it now.</LukkiSays>}
        {sub.status === 'released' && <LukkiSays mood="cheer">Your Fractions quiz is back. Let’s see what you did well!</LukkiSays>}
      </div>

      {sub.status === 'due' && (
        <Card className="p-5 mb-4 border-2 border-sky">
          <Label>Due Sunday</Label>
          <div className="font-display text-xl">Maths: Fractions quiz</div>
          <p className="text-sm text-muted mt-1">5 questions · take a photo of each page</p>
          <LinkBtn href="/student/hand-in/" big className="w-full mt-4">Hand in my work</LinkBtn>
        </Card>
      )}
      {waiting && (
        <Card className="p-5 mb-4">
          <Label>Handed in</Label>
          <div className="font-display text-xl">Fractions quiz</div>
          <div className="mt-3 flex items-center gap-2 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-sky animate-pulse" />Waiting for Mrs Rasha to check it</div>
          <p className="text-xs text-muted mt-2">You will see your result once your teacher has checked it.</p>
        </Card>
      )}
      {sub.status === 'released' && (
        <Link href="/student/results/" className="block mb-4">
          <Card className="p-5 border-2 border-sky">
            <div className="flex items-center"><Label>Back from your teacher</Label><Chip tone="sky" className="ml-auto">New</Chip></div>
            <div className="font-display text-xl">Fractions quiz</div>
            <p className="text-sm mt-1">You got lots right! Tap to see Lukki’s tips →</p>
          </Card>
        </Link>
      )}

      {notifs.length > 0 && (
        <div className="mb-5">
          <Label>From Mrs Rasha</Label>
          <div className="space-y-2">
            {notifs.slice(0, 3).map((n) => (
              <Link key={n.id} href={n.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${n.read ? 'bg-white border border-rule' : 'bg-tint font-semibold'}`}>
                <span className="w-2 h-2 rounded-full bg-azure shrink-0" style={{ opacity: n.read ? 0 : 1 }} />{n.text}
              </Link>
            ))}
            {s.announced.map((a) => <div key={a} className="rounded-xl px-3 py-2.5 text-sm bg-white border border-rule">Class note: {a}</div>)}
          </div>
        </div>
      )}

      <Label>My Gap Map</Label>
      <Card className="p-4">
        <div className="flex flex-col items-center gap-2 py-2">
          {gapPath.map((g, i) => {
            const off = [-50, 30, 70, 10, -40][i];
            const gap = g.state === 'gap' && (sub.status !== 'released' || flag.state !== 'dismissed');
            return (
              <Link key={g.topic} href={gap ? '/student/practice/' : '/student/progress/'} style={{ marginLeft: off }}
                className={`w-[86px] h-[86px] rounded-full grid place-items-center text-center text-[11px] font-semibold leading-tight p-2 border-4 ${g.state === 'done' ? 'bg-sky border-azure' : gap ? 'bg-white border-navy ring-4 ring-sky' : 'bg-ice border-rule text-muted'}`}>
                <span>{g.state === 'done' ? '✓ ' : gap ? '★ ' : ''}{g.topic}</span>
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-muted text-center">★ is the topic to practise next. Tap it to play, no marks!</p>
      </Card>
    </StudentShell>
  );
}
