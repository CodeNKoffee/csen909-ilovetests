'use client';
import { useState } from 'react';
import { StudentShell, LukkiSays } from '@/components/Shells';
import { Btn, Card, Label, LinkBtn } from '@/components/ui';
import Scan from '@/components/Scan';
import { useStore } from '@/lib/store';

const PAGES = [['q1', 'q2', 'q3'], ['q4', 'q5']];
type Shot = { page: number; blurry: boolean };

export default function HandIn() {
  const { s, d } = useStore();
  const sub = s.submissions['nour-frac'];
  const [step, setStep] = useState(sub.status === 'due' ? 0 : 4);
  const [shots, setShots] = useState<Shot[]>([]);
  const [tries, setTries] = useState(0);
  const current = shots.length < PAGES.length ? shots.length : -1;
  const blurry = shots.find((x) => x.blurry);

  const snap = () => {
    // Simulated camera: the first photo of page 2 comes out blurry, so the blur check can catch it.
    const isBlurry = current === 1 && tries === 0;
    setShots([...shots, { page: current, blurry: isBlurry }]);
    if (isBlurry) setTries(1);
  };
  const retake = () => setShots(shots.filter((x) => !x.blurry));
  const steps = ['Pick', 'Photos', 'Check', 'Send'];

  return (
    <StudentShell title="Hand in my work">
      {step < 4 && (
        <ol className="flex gap-1.5 mb-4" aria-label="Steps">
          {steps.map((t, i) => (
            <li key={t} className="flex-1 text-center text-[11px] font-semibold">
              <div className={`h-2.5 rounded-full mb-1 ${i <= step ? 'bg-azure' : 'bg-tint'}`} />
              <span className={i === step ? 'text-navy' : 'text-muted'}>{i + 1} {t}</span>
            </li>
          ))}
        </ol>
      )}

      {step === 0 && (
        <div className="space-y-4">
          <LukkiSays>Which work are you handing in?</LukkiSays>
          <button onClick={() => setStep(1)} className="w-full text-left">
            <Card className="p-5 border-2 border-azure">
              <Label>Due Sunday · Maths</Label>
              <div className="font-display text-xl">Fractions quiz</div>
              <div className="text-sm text-muted">2 pages · Mrs Rasha</div>
            </Card>
          </button>
          <Btn big className="w-full" onClick={() => setStep(1)}>Next: take photos</Btn>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          {current >= 0 ? (
            <>
              <div className="relative rounded-3xl bg-navy p-4" aria-label="Camera">
                <div className="relative">
                  <Scan examId="frac" answers={sub.answers} compact only={PAGES[current]} />
                  <div className="absolute inset-[-6px] border-[3px] border-dashed border-sky rounded-xl pointer-events-none" />
                </div>
                <p className="text-center text-white text-sm mt-3">Page {current + 1} of 2 · fit the whole page in the frame</p>
                <div className="flex justify-center mt-3">
                  <button onClick={snap} aria-label={`Take photo of page ${current + 1}`} className="w-[72px] h-[72px] rounded-full bg-white border-[6px] border-sky active:scale-95 transition" />
                </div>
              </div>
              <button className="w-full text-sm text-muted underline">or choose photos from the tablet</button>
            </>
          ) : (
            <LukkiSays mood="cheer">Both pages captured! Let’s check them.</LukkiSays>
          )}
          <Thumbs shots={shots} />
          {current < 0 && <Btn big className="w-full" onClick={() => setStep(2)}>Next: check my pages</Btn>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {blurry ? (
            <>
              <LukkiSays mood="think"><b>Page 2 is blurry.</b> I can’t read it yet. Can you take it again?</LukkiSays>
              <div className="grid grid-cols-2 gap-3">
                {shots.map((x) => (
                  <div key={x.page} className={`rounded-xl p-1.5 ${x.blurry ? 'ring-4 ring-navy' : 'ring-1 ring-rule'}`}>
                    <Scan examId="frac" answers={sub.answers} compact blur={x.blurry} only={PAGES[x.page]} />
                    <div className="text-center text-xs font-semibold mt-1">{x.blurry ? '! Page 2: blurry' : `✓ Page ${x.page + 1}: clear`}</div>
                  </div>
                ))}
              </div>
              <Btn big className="w-full" onClick={() => { retake(); setStep(1); }}>Take page 2 again</Btn>
            </>
          ) : (
            <>
              <LukkiSays mood="cheer">All pages are clear. I can read every answer!</LukkiSays>
              <Thumbs shots={shots} />
              <Btn big className="w-full" onClick={() => setStep(3)}>Next: send</Btn>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Card className="p-5">
            <Label>Ready to send</Label>
            <div className="font-display text-xl">Fractions quiz · 2 pages</div>
            <p className="text-sm text-muted mt-2">Mrs Rasha will check it first. You’ll see your result after she does.</p>
          </Card>
          <Btn big className="w-full" onClick={() => { d({ type: 'submit', id: 'nour-frac' }); setStep(4); }}>Send to Mrs Rasha</Btn>
          <Btn kind="ghost" className="w-full" onClick={() => setStep(2)}>Back</Btn>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5 pt-6 text-center">
          <LukkiSays mood="cheer">Sent! Well done, Nour. Mrs Rasha will check your quiz soon.</LukkiSays>
          <Card className="p-5 text-left">
            <div className="text-sm">Fractions quiz · handed in</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-sky animate-pulse" />Waiting for your teacher</div>
          </Card>
          <LinkBtn href="/student/" kind="soft" className="w-full">Back home</LinkBtn>
        </div>
      )}
    </StudentShell>
  );
}

function Thumbs({ shots }: { shots: Shot[] }) {
  return (
    <div className="flex gap-2">
      {[0, 1].map((p) => {
        const sh = shots.find((x) => x.page === p);
        return (
          <div key={p} className={`flex-1 h-16 rounded-xl grid place-items-center text-xs font-semibold ${sh ? (sh.blurry ? 'bg-white ring-2 ring-navy' : 'bg-tint') : 'border-2 border-dashed border-rule text-muted'}`}>
            {sh ? (sh.blurry ? `! Page ${p + 1}` : `✓ Page ${p + 1}`) : `Page ${p + 1}`}
          </div>
        );
      })}
    </div>
  );
}
