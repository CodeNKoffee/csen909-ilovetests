'use client';
// Parent view: calm, read-only, one column. Works on a parent's phone first.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Wordmark } from '../ui';

export function ParentShell({ children }: { children: ReactNode }) {
  return (
    <div className="fam min-h-dvh bg-ice relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none fixed -top-48 -right-40 w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle,#A9D5F8_0%,rgba(169,213,248,0)_66%)]" />
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-rule">
        <div className="max-w-[720px] mx-auto px-5 h-16 flex items-center gap-3">
          <Link href="/" aria-label="iLoveTests start page" className="rounded-lg"><Wordmark size="text-[21px]" suffix="Parents" /></Link>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-ice border border-rule pl-1 pr-3 py-1">
            <span aria-hidden className="grid place-items-center w-8 h-8 rounded-full bg-sky font-display text-[15px]">N</span>
            <span className="text-[14px] font-bold"><span className="sr-only">Child: </span>Nour<span className="sr-only"> Khaled</span><span className="hidden sm:inline font-semibold text-muted"> · Year 4B</span></span>
          </div>
        </div>
      </header>
      <main className="relative max-w-[720px] mx-auto px-5 pt-6 pb-40">{children}</main>
    </div>
  );
}
