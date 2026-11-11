// Mock data for the iLoveTests prototype. All "AI" output (OCR text, confidence,
// suggested marks, hints, flags) is hard-coded, as the course brief allows.

export type Lang = 'en' | 'de';

export interface Step { label: string; marks: number }
export interface Question {
  id: string;
  n: number;
  prompt: string;
  steps: Step[];          // the mark scheme, step by step
  answer: string;         // model answer shown to the teacher
  concept: string;
}
export interface Exam {
  id: string;
  title: string;
  subject: string;
  className: string;
  lang: Lang;
  due: string;
  questions: Question[];
}

export interface SeedAnswer {
  qid: string;
  written: string[];      // what the child actually wrote (lines), drawn on the scan
  ocr: string;            // what the AI read
  conf: number;           // AI reading confidence 0–1
  aiMarks: number[];      // AI suggestion per step, blind (memory off)
  aiMarksHistory?: number[]; // AI suggestion when it can see the child's history
  reason: string;         // why the AI suggested these marks
  hint?: string;          // attention hint: why this answer needs a second look
  feedback: string;       // suggested child-friendly feedback
}

export interface Student { id: string; name: string; short: string; className: string }

export const TEACHER = { name: 'Mrs Rasha', full: 'Mrs Rasha ElNahas', school: 'Maadi Narmer School' };
export const ASSISTANT = { name: 'Hatem', full: 'Hatem Soliman' };

export const exams: Record<string, Exam> = {
  frac: {
    id: 'frac',
    title: 'Fractions quiz',
    subject: 'Maths',
    className: 'Year 4B',
    lang: 'en',
    due: 'Sunday 15 November',
    questions: [
      { id: 'q1', n: 1, prompt: '1/2 + 1/4 = ?', concept: 'Adding fractions',
        steps: [{ label: 'Method: same bottom number (2/4 + 1/4)', marks: 1 }, { label: 'Answer: 3/4', marks: 1 }], answer: '2/4 + 1/4 = 3/4' },
      { id: 'q2', n: 2, prompt: 'Which is bigger: 3/5 or 2/3? Show your working.', concept: 'Comparing fractions',
        steps: [{ label: 'Method: change both to fifteenths (9/15, 10/15)', marks: 1 }, { label: 'Answer: 2/3 is bigger', marks: 1 }], answer: '3/5 = 9/15, 2/3 = 10/15, so 2/3 is bigger' },
      { id: 'q3', n: 3, prompt: 'Sara ate 2/8 of a pizza and Omar ate 3/8. How much is left?', concept: 'Word problems',
        steps: [{ label: 'Method: add what they ate (5/8)', marks: 1 }, { label: 'Method: take it from the whole (8/8 − 5/8)', marks: 1 }, { label: 'Answer: 3/8', marks: 1 }], answer: '2/8 + 3/8 = 5/8; 8/8 − 5/8 = 3/8' },
      { id: 'q4', n: 4, prompt: 'Simplify 6/9.', concept: 'Simplifying fractions',
        steps: [{ label: 'Method: divide top and bottom by 3', marks: 1 }, { label: 'Answer: 2/3', marks: 1 }], answer: '6/9 = 2/3' },
      { id: 'q5', n: 5, prompt: '7 × 6 = ?', concept: 'Times tables',
        steps: [{ label: 'Answer: 42', marks: 1 }], answer: '42' },
    ],
  },
  bruch: {
    id: 'bruch',
    title: 'Mathe-Test: Brüche',
    subject: 'Mathe',
    className: 'Klasse 4 (Deutsch)',
    lang: 'de',
    due: 'Donnerstag, 12. November',
    questions: [
      { id: 'd1', n: 1, prompt: '1/3 + 1/3 = ?', concept: 'Brüche addieren',
        steps: [{ label: 'Lösung: 2/3', marks: 1 }], answer: '2/3' },
      { id: 'd2', n: 2, prompt: 'Was ist größer: 3/4 oder 2/3?', concept: 'Brüche vergleichen',
        steps: [{ label: 'Weg: gleichnamig machen (9/12, 8/12)', marks: 1 }, { label: 'Lösung: 3/4 ist größer', marks: 1 }], answer: '3/4 = 9/12, 2/3 = 8/12, also ist 3/4 größer' },
      { id: 'd3', n: 3, prompt: 'Kürze 4/8.', concept: 'Brüche kürzen',
        steps: [{ label: 'Weg: durch 4 teilen', marks: 1 }, { label: 'Lösung: 1/2', marks: 1 }], answer: '4/8 = 1/2' },
    ],
  },
};

export const students: Student[] = [
  { id: 'nour', name: 'Nour Khaled', short: 'Nour K.', className: 'Year 4B' },
  { id: 'lina', name: 'Lina Becker', short: 'Lina B.', className: 'Klasse 4 (Deutsch)' },
  { id: 'omar', name: 'Omar Sherif', short: 'Omar S.', className: 'Year 4B' },
  { id: 'laila', name: 'Laila Mostafa', short: 'Laila M.', className: 'Year 4B' },
  { id: 'youssef', name: 'Youssef Adel', short: 'Youssef A.', className: 'Year 4B' },
  { id: 'malak', name: 'Malak Hassan', short: 'Malak H.', className: 'Year 4B' },
  { id: 'adam', name: 'Adam Fawzy', short: 'Adam F.', className: 'Year 4B' },
  { id: 'farida', name: 'Farida Nabil', short: 'Farida N.', className: 'Year 4B' },
];

// Nour's paper: what she wrote, what the AI read, and its suggestions.
export const nourSeed: SeedAnswer[] = [
  { qid: 'q1', written: ['2/4 + 1/4 = 3/4'], ocr: '2/4 + 1/4 = 3/4', conf: 0.96, aiMarks: [1, 1],
    reason: 'Same bottom number used, answer matches the mark scheme.', feedback: 'Great job finding the same bottom number!' },
  { qid: 'q2', written: ['3/5 = 9/15', '2/3 = 10/15', 'so 3/5 is bigger'], ocr: '3/5 = 9/15, 2/3 = 10/15, so 3/5 is bigger', conf: 0.71, aiMarks: [1, 0], aiMarksHistory: [1, 0],
    reason: 'Correct method (fifteenths), but the comparison is the wrong way round: 10/15 is bigger than 9/15.',
    hint: 'Same mistake in 3 assignments in a row: comparing fractions.',
    feedback: 'Your steps were right! When the bottom numbers match, the bigger top number wins: 10/15 is bigger.' },
  { qid: 'q3', written: ['2/8 + 3/8 = 5/8', '= 3/8'], ocr: '2/8 + 3/8 = 5/8 = 3/8', conf: 0.83, aiMarks: [1, 0, 1], aiMarksHistory: [1, 0, 1],
    reason: 'Added correctly and the final answer is right, but the step 8/8 − 5/8 is not written.',
    hint: 'Steps differ from the mark scheme: right answer, one step missing.',
    feedback: 'Right answer! Next time write how you got from 5/8 to 3/8.' },
  { qid: 'q4', written: ['6/9 = 2/3'], ocr: '6/9 = 2/5', conf: 0.58, aiMarks: [1, 1],
    reason: 'Divided top and bottom by 3; answer 2/3 after the text check.', feedback: 'Well simplified!' },
  { qid: 'q5', written: ['42'], ocr: '', conf: 0.22, aiMarks: [1],
    reason: 'Answer 42 matches the mark scheme.', feedback: 'Your times tables are strong!' },
];

export const linaSeed: SeedAnswer[] = [
  { qid: 'd1', written: ['2/3'], ocr: '2/3', conf: 0.94, aiMarks: [1], reason: 'Lösung stimmt.', feedback: 'Super gemacht!' },
  { qid: 'd2', written: ['3/4 = 9/12', '2/3 = 8/12', 'also 3/4 größer'], ocr: '3/4 = 9/12, 2/3 = 8/12, also 3/4 grober', conf: 0.66, aiMarks: [1, 1],
    reason: 'Gleichnamig gemacht und richtig verglichen. („größer“ nach der Textprüfung)', feedback: 'Toll verglichen!' },
  { qid: 'd3', written: ['4/8 = 2/4'], ocr: '4/8 = 2/4', conf: 0.9, aiMarks: [1, 0],
    reason: 'Gekürzt, aber nicht vollständig: 2/4 lässt sich weiter kürzen.', hint: 'Antwort teilweise richtig.',
    feedback: 'Fast! 2/4 kann man noch weiter kürzen.' },
];

// Nour's results before this quiz (for the Learning Timeline and Gap Map).
export const nourHistory = [
  { exam: 'Adding and subtracting', date: 'Sep', score: 90, concepts: { 'Adding fractions': 100 } },
  { exam: 'Times tables quiz', date: 'Oct', score: 78, concepts: { 'Times tables': 78 } },
  { exam: 'Fractions homework 1', date: 'Oct', score: 70, concepts: { 'Comparing fractions': 50 } },
  { exam: 'Fractions homework 2', date: 'Nov', score: 75, concepts: { 'Comparing fractions': 50 } },
];

export const gapPath = [
  { topic: 'Adding', state: 'done' },
  { topic: 'Times tables', state: 'done' },
  { topic: 'Comparing fractions', state: 'gap' },
  { topic: 'Shapes', state: 'next' },
  { topic: 'Telling time', state: 'next' },
] as const;

export const conceptLinks = [
  { from: 'Comparing fractions', to: 'Division', subject: 'Maths' },
  { from: 'Comparing fractions', to: 'Measuring', subject: 'Science' },
];

export const classMistakes = [
  { label: 'Missing working steps', pct: 62 },
  { label: 'Comparing fractions with different bottom numbers', pct: 48 },
  { label: 'Hard-to-read handwriting', pct: 30 },
];

// Other pupils' status in the Fractions quiz (pre-filled for the class view).
export const classBatch = [
  { id: 'omar', status: 'drafted', score: 6, by: 'assistant' },
  { id: 'laila', status: 'drafted', score: 7, by: 'assistant' },
  { id: 'youssef', status: 'confirmed', score: 9, by: 'teacher' },
  { id: 'malak', status: 'confirmed', score: 10, by: 'teacher' },
  { id: 'adam', status: 'checked', score: 0, by: '' },
  { id: 'farida', status: 'due', score: 0, by: '' },
] as const;

export const practiceItems = [
  { a: '1/2', b: '1/3', bigger: 'a', tip: 'Make the bottom numbers the same: 3/6 and 2/6.' },
  { a: '2/5', b: '3/4', bigger: 'b', tip: 'Twentieths: 8/20 and 15/20.' },
  { a: '5/6', b: '2/3', bigger: 'a', tip: 'Sixths: 5/6 and 4/6.' },
];
