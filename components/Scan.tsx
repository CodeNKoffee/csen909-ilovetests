// A simulated scanned exam paper: printed questions + the child's handwriting.
import { exams } from '@/lib/data';
import type { AnswerState } from '@/lib/store';

export default function Scan({ examId, answers, highlight, blur = false, compact = false, name = 'Nour Khaled', only }: {
  examId: string; answers: Pick<AnswerState, 'qid' | 'written' | 'conf'>[]; highlight?: string; blur?: boolean; compact?: boolean; name?: string; only?: string[];
}) {
  const exam = exams[examId];
  return (
    <div className={`relative bg-white rounded-md shadow-sm border border-rule overflow-hidden ${compact ? 'text-[10px]' : 'text-sm'}`}
      style={{ filter: blur ? 'blur(3.2px)' : undefined, backgroundImage: 'repeating-linear-gradient(transparent 0 27px, #EDF3F9 27px 28px)' }}>
      <div className={compact ? 'p-3' : 'p-5'}>
        <div className="flex justify-between border-b border-navy/30 pb-1 mb-2">
          <span className="font-semibold">{exam.title} · {exam.className}</span>
          <span>Name: <span className="font-hand text-[1.25em] text-[#1d3d8f]">{name}</span></span>
        </div>
        {exam.questions.filter((q) => !only || only.includes(q.id)).map((q) => {
          const a = answers.find((x) => x.qid === q.id);
          const messy = a && a.conf < 0.3;
          const on = highlight === q.id;
          return (
            <div key={q.id} className={`relative ${compact ? 'mb-1.5' : 'mb-3'} rounded ${on ? 'ring-[3px] ring-azure bg-tint/40' : ''}`}>
              <div className="text-navy/80">{q.n}. {q.prompt}</div>
              <div className={`font-hand text-[#1d3d8f] ${compact ? 'text-[13px] pl-3' : 'text-[22px] pl-6'} leading-tight`}
                style={messy ? { transform: 'rotate(-4deg) skewX(-18deg)', letterSpacing: '-0.18em', opacity: 0.55, filter: 'blur(0.6px)' } : undefined}>
                {a?.written.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
