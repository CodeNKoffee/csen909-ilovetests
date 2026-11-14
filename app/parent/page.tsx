'use client';
// Parent view (bonus): a weekly digest. Parents read, never change, and see results
// and practice only after Mrs Rasha has released them: never unchecked AI output.
import { useEffect, useState } from 'react';
import { ParentShell } from '@/components/parent/ParentShell';
import { Icon, Pill, Tile, type IconName } from '@/components/student/Kid';
import { ScoreRing } from '@/components/student/Bits';
import ScoreChart, { scoreRows } from '@/components/ScoreChart';
import Lukki from '@/components/Lukki';
import { useStore, total, maxOf } from '@/lib/store';
import { exams, conceptLinks } from '@/lib/data';

export default function Parent() {
  return (
    <ParentShell>
      <Digest />
    </ParentShell>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="font-display text-[20px] mt-8 mb-3">{children}</h2>;
}

function Digest() {
  const { s, d, ready } = useStore();
  const sub = s.submissions['nour-frac'];
  const flag = s.flags.find((f) => f.id === 'f-nour')!;
  const due = sub.status === 'due';
  const checked = sub.status === 'confirmed'; // confirmed by Mrs Rasha, not released yet
  const released = sub.status === 'released';
  // Team review (v1.0.1): parents see results and practice only after release.
  const help = released && flag.state === 'confirmed';
  const practised = released && s.practiceDone > 0;
  const rows = scoreRows(sub);
  const avg = Math.round(rows.reduce((p, r) => p + r.pct, 0) / rows.length);
  const latest = rows[rows.length - 1];

  // Remember what was new when the page opened, then mark it read (demo step 8).
  const [fresh, setFresh] = useState<string[]>([]);
  useEffect(() => {
    if (!ready) return;
    setFresh(s.notifs.filter((n) => n.to === 'parent' && !n.read).map((n) => n.id));
    d({ type: 'read', to: 'parent' });
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <div className="h-[60vh]" aria-busy="true" />;

  const exam = exams.frac;
  const q = sub.answers.map((a, i) => {
    const qq = exam.questions[i];
    const got = a.marks.reduce((x, y) => x + y, 0);
    const max = qq.steps.reduce((x, y) => x + y.marks, 0);
    return { n: qq.n, concept: qq.concept, got, max, full: got === max };
  });
  const right = q.filter((x) => x.full).length;
  const strong = [...new Set(q.filter((x) => x.full).map((x) => x.concept))];
  const working = [...new Set(q.filter((x) => !x.full).map((x) => x.concept))];
  const timeOf = (re: RegExp) => s.audit.find((e) => re.test(e.text))?.t;

  const steps = [
    { t: 'Handed in', state: due ? 'later' : 'done' },
    { t: 'Checked by Mrs Rasha', state: due ? 'later' : released || checked ? 'done' : 'now' },
    { t: 'Result shared', state: released ? 'done' : checked ? 'now' : 'later' },
  ] as const;

  const updates: { icon: IconName; text: string; t?: string; isNew?: boolean }[] = [];
  if (practised) updates.push({ icon: 'star', text: 'Nour finished a practice round on comparing fractions. Practice is never marked.' });
  if (released) updates.push({ icon: 'check', text: `Mrs Rasha confirmed Nour’s Fractions quiz: ${total(sub)} out of ${maxOf('frac')}.`, t: timeOf(/released/), isNew: fresh.includes('n-par') });
  if (help) updates.push({ icon: 'target', text: 'Mrs Rasha suggested a little extra practice in comparing fractions.' });
  s.announced.forEach((a) => updates.push({ icon: 'megaphone', text: `Note to the class: ${a}` }));
  if (!due) updates.push({ icon: 'camera', text: 'Nour handed in the Fractions quiz (2 pages, photos checked for blur).', t: timeOf(/handed in/) });
  updates.push({ icon: 'paper', text: `Mrs Rasha set the Fractions quiz, due ${exam.due}.` });

  return (
    <div>
      <p className="text-[13px] font-semibold text-muted">Weekly digest · week of 15 November</p>
      <h1 className="font-display text-[30px] leading-tight">Nour’s week</h1>

      {/* This week's quiz, in one card */}
      <section aria-labelledby="this-week" className="rise relative overflow-hidden mt-4 rounded-[28px] bg-navy text-white p-5 sm:p-6">
        <span aria-hidden className="absolute -right-12 -top-14 w-44 h-44 rounded-full bg-sky/15" />
        <div className="relative">
          {released ? <Pill tone="sky"><Icon name="check" size={13} strokeWidth={3.2} />Confirmed by Mrs Rasha</Pill>
            : due ? <Pill tone="sun"><Icon name="clock" size={13} strokeWidth={2.6} />Due Sunday</Pill>
              : <Pill tone="line" className="bg-white"><span className="pulse-dot w-2 h-2 rounded-full bg-navy" />{checked ? 'Checked, sharing soon' : 'Being checked'}</Pill>}
          <div className="mt-3 flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <h2 id="this-week" className="font-display text-[24px] leading-tight">
                {released ? 'Fractions quiz is back' : due ? 'Fractions quiz is due Sunday' : 'Fractions quiz handed in'}
              </h2>
              <p className="text-[15px] text-white/85 mt-1.5 leading-snug">
                {released ? `Nour got ${right} of ${q.length} questions fully right.`
                  : due ? 'Not handed in yet. Nour photographs each page in iLoveTests, and Lukki checks the photos are clear first.'
                    : checked ? 'Checked. Mrs Rasha will share it soon. You will see the result here once she releases it, never before.'
                      : 'Handed in. Mrs Rasha is checking it. You will see the result here once she releases it, never before.'}
              </p>
            </div>
            {released && (
              <div className="shrink-0 text-right">
                <div className="font-display text-[44px] leading-none tabular-nums">{total(sub)}<span className="text-[22px] text-white/80"> / {maxOf('frac')}</span></div>
              </div>
            )}
          </div>
          <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Where the quiz is">
            {steps.map((x) => (
              <li key={x.t} className="flex flex-col items-start gap-1.5" aria-current={x.state === 'now' ? 'step' : undefined}>
                <span className={`h-1.5 w-full rounded-full ${x.state === 'done' ? 'bg-sky' : x.state === 'now' ? 'bg-white' : 'bg-white/20'}`} />
                <span className={`text-[12px] leading-tight ${x.state === 'later' ? 'text-white/70' : 'font-bold'}`}>
                  {x.state === 'done' && <Icon name="check" size={12} strokeWidth={3.2} className="inline -mt-0.5 mr-0.5" />}{x.t}
                  <span className="sr-only">{x.state === 'done' ? ' (done)' : x.state === 'now' ? ' (now)' : ' (not yet)'}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* At a glance */}
      <ul className={`grid ${released ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5 mt-4`} aria-label="At a glance">
        {[
          { k: 'Latest result', v: `${latest.pct}%`, sub: latest.name },
          { k: 'Average this term', v: `${avg}%`, sub: `${rows.length} results` },
          ...(released ? [{ k: 'Practice this week', v: practised ? `${s.practiceDone} ${s.practiceDone === 1 ? 'round' : 'rounds'}` : 'None yet', sub: 'never marked' }] : []),
        ].map((x) => (
          <li key={x.k} className="rounded-3xl bg-white border-2 border-rule p-3 sm:p-4">
            <div className="text-[12px] font-bold text-muted leading-tight">{x.k}</div>
            <div className="font-display text-[22px] sm:text-[26px] leading-tight mt-1 tabular-nums">{x.v}</div>
            <div className="text-[12px] text-muted leading-tight mt-0.5 truncate">{x.sub}</div>
          </li>
        ))}
      </ul>

      {released && (
        <section aria-labelledby="latest">
          <H2 id="latest">Latest result</H2>
          <Tile className="p-5">
            <div className="flex items-center gap-4">
              <ScoreRing got={total(sub)} max={maxOf('frac')} size={96} />
              <div className="min-w-0">
                <h3 className="font-display text-[19px] leading-tight">Fractions quiz</h3>
                <p className="text-[13px] text-muted mt-0.5">Maths · Year 4B · confirmed by Mrs Rasha</p>
                <p className="text-[15px] font-semibold mt-2">{right} of {q.length} questions fully right</p>
              </div>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-[13px] font-bold mb-1.5">Strong</h4>
                <div className="flex flex-wrap gap-1.5">{strong.map((c) => <Pill key={c} tone="sky"><Icon name="star" size={12} filled strokeWidth={1.5} />{c}</Pill>)}</div>
              </div>
              <div>
                <h4 className="text-[13px] font-bold mb-1.5">Working on</h4>
                <div className="flex flex-wrap gap-1.5">{working.map((c) => <Pill key={c} tone="line"><Icon name="target" size={12} />{c}</Pill>)}</div>
              </div>
            </div>
            <ul className="mt-5 border-t-2 border-ice" aria-label="Question by question">
              {q.map((x) => (
                <li key={x.n} className="flex items-center gap-3 py-2.5 border-b border-ice last:border-0 text-[14px]">
                  <span className="grid place-items-center w-7 h-7 shrink-0 rounded-lg bg-ice font-display text-[13px]" aria-hidden>{x.n}</span>
                  <span className="flex-1 min-w-0"><span className="sr-only">Question {x.n}: </span>{x.concept}</span>
                  {x.full ? <Pill tone="sky"><Icon name="check" size={12} strokeWidth={3.2} />Got it</Pill> : <Pill tone="line"><Icon name="circle" size={12} strokeWidth={2.6} />Not yet</Pill>}
                  <span className="w-14 text-right text-[12px] font-semibold text-muted tabular-nums">{x.got} of {x.max}</span>
                </li>
              ))}
            </ul>
            {sub.comment && (
              <div className="mt-4 flex gap-3 rounded-2xl bg-ice p-3.5">
                <span aria-hidden className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-navy text-white font-display text-[16px]">R</span>
                <p className="text-[15px] leading-snug"><span className="block text-[12px] font-bold text-muted">Mrs Rasha wrote</span>“{sub.comment}”</p>
              </div>
            )}
          </Tile>
        </section>
      )}

      {help && (
        <section aria-labelledby="help">
          <H2 id="help">How you can help at home</H2>
          <Tile className="p-5">
            <p className="text-[16px] leading-snug">Mrs Rasha suggests a little extra practice in <b>comparing fractions</b>. Ten minutes this week is plenty.</p>
            <ol className="mt-4 space-y-3">
              {[
                { icon: 'star' as IconName, t: 'Ask Nour to show you Lukki’s 3 fraction games in iLoveTests. They take about 5 minutes and are never marked.' },
                { icon: 'pencil' as IconName, t: 'Try it at dinner: is 1/2 or 1/3 of a pizza bigger? Cut both into sixths and count the slices.' },
                { icon: 'check' as IconName, t: 'Praise the steps she writes down, not only the final answer.' },
              ].map((x) => (
                <li key={x.t} className="flex gap-3 text-[15px] leading-snug">
                  <span className="grid place-items-center w-9 h-9 shrink-0 rounded-xl bg-tint"><Icon name={x.icon} size={18} /></span>
                  <span className="pt-1.5">{x.t}</span>
                </li>
              ))}
            </ol>
            <p className={`mt-4 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[14px] font-semibold ${practised ? 'bg-sky' : 'bg-ice'}`}>
              <Icon name={practised ? 'check' : 'clock'} size={16} strokeWidth={2.8} />
              {practised ? 'Nour has already played a practice round this week.' : 'Nour hasn’t started the practice yet.'}
            </p>
            <div className="mt-4 flex items-end gap-3 rounded-2xl border-2 border-rule p-3.5">
              <Lukki size={48} mood="happy" className="shrink-0" />
              <p className="text-[14px] leading-snug"><span className="block text-[12px] font-bold text-muted">What Nour sees</span>“{flag.note}”</p>
            </div>
            <p className="mt-4 text-[13px] text-muted">
              Why it matters: comparing fractions comes back later in {conceptLinks.map((c) => `${c.to} (${c.subject})`).join(' and ')}.
            </p>
          </Tile>
        </section>
      )}

      <div className="mt-8"><ScoreChart rows={rows} title="This term · released results" newest={released} id="term" /></div>

      <section aria-labelledby="updates">
        <H2 id="updates">Updates</H2>
        <Tile className="p-2">
          <ol>
            {updates.map((u) => (
              <li key={u.text} className="flex items-start gap-3 p-3">
                <span className={`grid place-items-center w-10 h-10 shrink-0 rounded-xl ${u.isNew ? 'bg-sky' : 'bg-ice'}`}><Icon name={u.icon} size={19} /></span>
                <span className="flex-1 text-[15px] leading-snug pt-0.5">
                  {u.text}
                  {u.t && <span className="block text-[12px] text-muted mt-0.5">at {u.t}</span>}
                </span>
                {u.isNew && <Pill tone="navy">New</Pill>}
              </li>
            ))}
          </ol>
        </Tile>
      </section>

      <div className="mt-8 flex gap-3 rounded-3xl bg-white/70 border-2 border-dashed border-rule p-4 text-[14px] leading-snug">
        <Icon name="lock" size={20} className="shrink-0 mt-0.5" />
        <p>You can read, not change. You see results and practice only after Mrs Rasha releases them, never the AI’s first suggestion. In this demo the parent view has no sign-in, so it shows how the page would look. Questions go to Mrs Rasha through the school.</p>
      </div>
    </div>
  );
}
