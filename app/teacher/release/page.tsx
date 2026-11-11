'use client';
import { TeacherShell } from '@/components/Shells';
import { Btn, Card, Chip, Label } from '@/components/ui';
import { useStore, total, maxOf } from '@/lib/store';
import { exams, students } from '@/lib/data';
import { statusText } from '@/lib/labels';

export default function Release() {
  const { s, d } = useStore();
  const teacher = s.role === 'teacher';
  const subs = Object.values(s.submissions);
  const ready = subs.filter((x) => x.status === 'confirmed');
  return (
    <TeacherShell title="Release results">
      <p className="text-sm text-muted mb-4">Only confirmed results can be released. Students and parents are told at the same time.</p>
      <Card className="p-5 max-w-3xl">
        <ul className="divide-y divide-rule">
          {subs.map((x) => {
            const st = students.find((t) => t.id === x.studentId)!;
            return (
              <li key={x.id} className="py-3 flex items-center gap-3">
                <div>
                  <div className="font-semibold">{st.name}</div>
                  <div className="text-xs text-muted">{exams[x.examId].title}</div>
                </div>
                <Chip tone={x.status === 'released' ? 'sky' : x.status === 'confirmed' ? 'tint' : 'line'} className="ml-auto">{statusText[x.status]}</Chip>
                <span className="w-16 text-right font-display tabular-nums">{['confirmed', 'released'].includes(x.status) ? `${total(x)}/${maxOf(x.examId)}` : '—'}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 rounded-xl bg-ice p-3 text-sm">
          <Label>What Nour and her family will get</Label>
          Nour: “Your Fractions quiz is back. Lukki has feedback for you!” · Parent: a weekly digest with confirmed results only.
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Btn disabled={!teacher || ready.length === 0} onClick={() => d({ type: 'release', ids: ready.map((x) => x.id) })}>
            Release {ready.length} confirmed result{ready.length === 1 ? '' : 's'}
          </Btn>
          {!teacher && <span className="text-xs text-muted">Only Mrs Rasha can release results.</span>}
          {teacher && ready.length === 0 && <span className="text-xs text-muted">Confirm grades first.</span>}
        </div>
      </Card>
    </TeacherShell>
  );
}
