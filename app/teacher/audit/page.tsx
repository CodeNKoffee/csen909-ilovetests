'use client';
import { TeacherShell } from '@/components/Shells';
import { Card, Chip } from '@/components/ui';
import { useStore } from '@/lib/store';

const tone = { teacher: 'navy', assistant: 'tint', student: 'line', parent: 'line', ai: 'sky' } as const;
const name = { teacher: 'Mrs Rasha', assistant: 'Hatem', student: 'Nour', parent: 'Parent', ai: 'AI' } as const;

export default function Audit() {
  const { s } = useStore();
  return (
    <TeacherShell title="Audit trail">
      <p className="text-sm text-muted mb-4">Key workflow events: hand-ins, text checks, drafts, confirmations, overrides, red flags, announcements, releases and sign-ins. Newest first. Small edits such as typing a comment are not logged.</p>
      <Card className="p-5 max-w-3xl">
        {s.audit.length === 0 ? <p className="text-sm text-muted">Nothing yet. Start the demo by handing in Nour’s quiz.</p> : (
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
    </TeacherShell>
  );
}
