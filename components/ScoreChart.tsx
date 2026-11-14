'use client';
// One score chart for the student and parent views: one series, so no legend;
// the title names it. The newest bar is darker, a tap or hover reads any bar
// out, and the list under it is the same data as text (the chart's table view).
import { useState } from 'react';
import { nourHistory } from '@/lib/data';
import { total, maxOf, type Submission } from '@/lib/store';
import { Pill, Tile } from './student/Kid';

export type ScoreRow = { name: string; date: string; pct: number };

/** Nour's results this year; the Fractions quiz joins only once it is released. */
export function scoreRows(sub: Submission): ScoreRow[] {
  const rows = nourHistory.map((h) => ({ name: h.exam, date: h.date, pct: h.score }));
  if (sub.status === 'released') rows.push({ name: 'Fractions quiz', date: 'Nov', pct: Math.round((total(sub) / maxOf('frac')) * 100) });
  return rows;
}

export default function ScoreChart({ rows, title, newest = false, id = 'chart-title' }: { rows: ScoreRow[]; title: string; newest?: boolean; id?: string }) {
  const last = rows.length - 1;
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? last;

  return (
    <Tile as="section" className="p-4 pt-5" aria-labelledby={id}>
      <h2 id={id} className="font-display text-[18px] px-1">{title}</h2>
      <p className="text-[13px] text-muted px-1" aria-live="polite">
        <b className="text-navy">{rows[shown].name}</b> · {rows[shown].date} · {rows[shown].pct}%
      </p>
      <div className="relative mt-4 h-44 pl-8" onMouseLeave={() => setHover(null)}>
        {/* recessive grid */}
        {[100, 50, 0].map((g) => (
          <div key={g} aria-hidden className="absolute left-0 right-0 flex items-center gap-1.5" style={{ bottom: `${g}%`, transform: 'translateY(50%)' }}>
            <span className="w-6 text-right text-[11px] font-semibold text-muted tabular-nums">{g}</span>
            <span className={`flex-1 h-px ${g === 0 ? 'bg-navy/30' : 'bg-rule'}`} />
          </div>
        ))}
        <div className="relative h-full flex items-end gap-[6px] pl-1.5">
          {rows.map((r, i) => (
            <button key={r.name} type="button" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} onClick={() => setHover(i)}
              aria-label={`${r.name}, ${r.date}: ${r.pct}%`}
              className="relative flex-1 h-full flex items-end justify-center rounded-t-md">
              {i === shown && (
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy text-white text-[12px] font-bold px-2 py-1 tabular-nums" style={{ bottom: `calc(${r.pct}% + 8px)` }}>
                  {r.pct}%
                </span>
              )}
              <span className={`block w-full max-w-[40px] rounded-t-[4px] transition-colors ${i === last ? 'bg-azure' : i === shown ? 'bg-[#5BAAE8]' : 'bg-sky'}`} style={{ height: `${r.pct}%` }} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-[6px] pl-[38px] mt-2" aria-hidden>
        {rows.map((r, i) => <span key={r.name} className={`flex-1 text-center text-[12px] ${i === last ? 'font-extrabold' : 'font-semibold text-muted'}`}>{r.date}</span>)}
      </div>

      <ol className="mt-4 border-t-2 border-ice pt-2">
        {rows.map((r, i) => (
          <li key={r.name} className="flex items-center gap-2 py-2 text-[14px] border-b border-ice last:border-0">
            <span className="w-9 text-[12px] font-semibold text-muted">{r.date}</span>
            <span className={`flex-1 ${i === last ? 'font-bold' : ''}`}>{r.name}</span>
            {i === last && newest && <Pill tone="sun">New</Pill>}
            <span className="font-display text-[16px] tabular-nums w-12 text-right">{r.pct}%</span>
          </li>
        ))}
      </ol>
    </Tile>
  );
}
