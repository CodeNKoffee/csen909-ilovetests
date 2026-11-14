'use client';
import { StudentShell } from '@/components/student/StudentShell';
import { Icon, LukkiBubble, SectionTitle, Tile } from '@/components/student/Kid';
import ScoreChart, { scoreRows } from '@/components/ScoreChart';
import { useStore } from '@/lib/store';

export default function Progress() {
  return (
    <StudentShell title="My progress" kicker="Maths · this year">
      <Body />
    </StudentShell>
  );
}

function Body() {
  const { s } = useStore();
  const sub = s.submissions['nour-frac'];
  const released = sub.status === 'released';
  const rows = scoreRows(sub);

  // Skills: words carry the meaning; the meter only repeats it.
  const skills = [
    { name: 'Adding fractions', level: 3, text: 'Always right' },
    { name: 'Times tables', level: released ? 3 : 2, text: released ? 'Right this time' : 'Getting there' },
    { name: 'Simplifying fractions', level: released ? 3 : 2, text: released ? 'Right this time' : 'Getting there' },
    { name: 'Comparing fractions', level: 1, text: 'Your next goal', goal: true },
  ];

  return (
    <div className="space-y-4">
      <LukkiBubble still>Every exam you hand in adds a step to your path.</LukkiBubble>

      <ScoreChart rows={rows} title="My scores" newest={released} />

      <section aria-labelledby="skills">
        <SectionTitle id="skills">Getting stronger</SectionTitle>
        <Tile as="div" className="p-2">
          <ul>
            {skills.map((k) => (
              <li key={k.name} className="flex items-center gap-3 p-3 rounded-2xl">
                <span className={`grid place-items-center w-11 h-11 shrink-0 rounded-2xl ${k.goal ? 'bg-sun' : 'bg-sky'}`}>
                  <Icon name={k.goal ? 'star' : 'check'} size={k.goal ? 22 : 20} filled={k.goal} strokeWidth={k.goal ? 1.6 : 3} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-bold leading-tight">{k.name}</span>
                  <span className="block text-[13px] text-muted">{k.text}</span>
                </span>
                <span className="flex gap-1" role="img" aria-label={`Level ${k.level} of 3`}>
                  {[1, 2, 3].map((l) => <span key={l} className={`w-3 h-6 rounded-full ${l <= k.level ? 'bg-azure' : 'bg-tint'}`} />)}
                </span>
              </li>
            ))}
          </ul>
        </Tile>
      </section>
    </div>
  );
}
