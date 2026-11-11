import Link from 'next/link';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

export function Wordmark({ size = 'text-2xl', suffix }: { size?: string; suffix?: string }) {
  return (
    <span className={`font-display ${size} leading-none whitespace-nowrap`}>
      <span className="text-azure">iLove</span><span className="text-navy">Tests</span>
      {suffix && <span className="ml-2 text-xs font-sans font-semibold text-muted align-middle tracking-wide uppercase">{suffix}</span>}
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'soft' | 'ghost' | 'sky'; big?: boolean };
export function Btn({ kind = 'primary', big, className = '', ...p }: BtnProps) {
  const k = {
    primary: 'bg-navy text-white hover:bg-[#1b3f5c]',
    sky: 'bg-sky text-navy hover:bg-[#5daee9]',
    soft: 'bg-tint text-navy hover:bg-[#d3e7f8]',
    ghost: 'bg-white text-navy border border-rule hover:bg-ice',
  }[kind];
  return <button {...p} className={`${k} ${big ? 'px-6 py-4 text-lg rounded-2xl' : 'px-4 py-2.5 text-sm rounded-xl'} font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed min-h-11 ${className}`} />;
}

export function LinkBtn({ href, kind = 'primary', big, children, className = '' }: { href: string; kind?: BtnProps['kind']; big?: boolean; children: ReactNode; className?: string }) {
  const k = { primary: 'bg-navy text-white', sky: 'bg-sky text-navy', soft: 'bg-tint text-navy', ghost: 'bg-white text-navy border border-rule' }[kind];
  return <Link href={href} className={`${k} ${big ? 'px-6 py-4 text-lg rounded-2xl' : 'px-4 py-2.5 text-sm rounded-xl'} inline-flex items-center justify-center font-semibold min-h-11 ${className}`}>{children}</Link>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-rule ${className}`}>{children}</div>;
}

export function Chip({ children, tone = 'tint', className = '' }: { children: ReactNode; tone?: 'tint' | 'navy' | 'line' | 'sky'; className?: string }) {
  const t = { tint: 'bg-tint text-navy', navy: 'bg-navy text-white', line: 'border border-rule text-navy bg-white', sky: 'bg-sky text-navy' }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${t} ${className}`}>{children}</span>;
}

export function Bar({ pct, label }: { pct: number; label?: string }) {
  return (
    <div>
      <div className="h-2.5 rounded-full bg-tint overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full bg-azure rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-1.5">{children}</div>;
}
