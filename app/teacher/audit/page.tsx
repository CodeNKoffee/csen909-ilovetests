'use client';
import { TeacherShell } from '@/components/Shells';
import { Card, Chip } from '@/components/ui';
import { useStore } from '@/lib/store';

const tone = { teacher: 'navy', assistant: 'tint', student: 'line', parent: 'line', ai: 'sky' } as const;
const name = { teacher: 'Mrs Rasha', assistant: 'Hatem', student: 'Nour', parent: 'Parent', ai: 'AI' } as const;

// Fixed history from before the demo starts, matching the batch on the teacher home.
const earlier: { t: string; actor: 'teacher' | 'assistant' | 'student'; text: string }[] = [
  { t: 'Wed', actor: 'teacher', text: 'Mrs Rasha confirmed the grades for Malak Hassan’s Fractions quiz: 10/10' },
  { t: 'Wed', actor: 'teacher', text: 'Mrs Rasha confirmed the grades for Youssef Adel’s Fractions quiz: 9/10' },
  { t: 'Tue', actor: 'assistant', text: 'Hatem (assistant) sent draft grades for Omar Sherif (6/10) and Laila Mostafa (7/10) to Mrs Rasha' },
  { t: 'Mon', actor: 'teacher', text: 'Mrs Rasha released Fractions homework 2 to Year 4B students and parents' },
];

export default function Audit() {
  const { s } = useStore();
  return (
    <TeacherShell title="Audit trail">
      <p className="text-sm text-muted mb-4">Key workflow events: hand-ins, text checks, drafts, confirmations, overrides, red flags, announcements, releases and sign-ins. Newest first. Small edits such as typing a comment are not logged.</p>
      <Card className="p-5 max-w-3xl">
        {s.audit.length === 0 ? <p className="text-sm text-muted">No events in this demo yet. Start by handing in Nour’s quiz.</p> : (
          <ol className="space-y-3">
            {s.audit.map((e, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-muted tabular-nums w-12 pt-0.5">{e.t}</span>
                <Chip tone={tone[e.actor]} className="w-24 justify-center">{name[e.actor]}</Chip>
                <span className="flex-1">{e.text}</span>
              </li>
            ))}
          </ol>
        )}
      </Card>
      <Card className="p-5 max-w-3xl mt-4">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted mb-3">Earlier this week (before the demo)</div>
        <ol className="space-y-3">
          {earlier.map((e, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-xs text-muted w-12 pt-0.5">{e.t}</span>
              <Chip tone={tone[e.actor]} className="w-24 justify-center">{name[e.actor]}</Chip>
              <span className="flex-1">{e.text}</span>
            </li>
          ))}
        </ol>
      </Card>
    </TeacherShell>
  );
}
