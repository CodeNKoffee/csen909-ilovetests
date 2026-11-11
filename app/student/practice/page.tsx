'use client';
import { useState } from 'react';
import { StudentShell, LukkiSays } from '@/components/Shells';
import { Btn, Card, LinkBtn } from '@/components/ui';
import { practiceItems } from '@/lib/data';
import { useStore } from '@/lib/store';

function FracBar({ f, picked, onPick }: { f: string; picked?: boolean; onPick: () => void }) {
  const [n, dn] = f.split('/').map(Number);
  return (
    <button onClick={onPick} className={`w-full rounded-2xl p-4 bg-white border-2 text-left transition ${picked ? 'border-navy ring-4 ring-sky' : 'border-rule hover:border-sky'}`}>
      <div className="font-display text-3xl mb-2">{f}</div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: dn }).map((_, i) => <div key={i} className={`h-8 flex-1 rounded-md ${i < n ? 'bg-sky' : 'bg-tint'}`} />)}
      </div>
    </button>
  );
}

export default function Practice() {
  const { d } = useStore();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<'a' | 'b' | null>(null);
  const [done, setDone] = useState(false);
  const item = practiceItems[i];
  const right = pick === item?.bigger;

  if (done) {
    return (
      <StudentShell title="Practice">
        <div className="pt-6 space-y-4">
          <LukkiSays mood="cheer">You compared 3 fractions! The trick: make the bottom numbers the same, then the bigger top number wins.</LukkiSays>
          <Card className="p-4 text-sm text-muted text-center">This was practice: no marks are recorded.</Card>
          <LinkBtn href="/student/" kind="soft" className="w-full">Back home</LinkBtn>
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell title="Practice: comparing fractions">
      <div className="space-y-4 pt-1">
        <div className="flex gap-1.5">{practiceItems.map((_, k) => <div key={k} className={`h-2.5 flex-1 rounded-full ${k <= i ? 'bg-azure' : 'bg-tint'}`} />)}</div>
        <LukkiSays mood={pick === null ? 'happy' : right ? 'cheer' : 'think'}>
          {pick === null ? 'Which fraction is bigger? Tap it.' : right ? `Yes! ${item.tip}` : `Not yet! Tip: ${item.tip}`}
        </LukkiSays>
        <FracBar f={item.a} picked={pick === 'a'} onPick={() => setPick('a')} />
        <FracBar f={item.b} picked={pick === 'b'} onPick={() => setPick('b')} />
        {pick !== null && (right
          ? <Btn big className="w-full" onClick={() => { if (i + 1 < practiceItems.length) { setI(i + 1); setPick(null); } else { d({ type: 'practice' }); setDone(true); } }}>{i + 1 < practiceItems.length ? 'Next one' : 'Finish'}</Btn>
          : <Btn big kind="sky" className="w-full" onClick={() => setPick(null)}>Try again</Btn>)}
        <p className="text-xs text-muted text-center">Practice is never marked.</p>
      </div>
    </StudentShell>
  );
}
