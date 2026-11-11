// Regenerates every image in docs/readme/ and the social/app icons in public/.
// Usage: npm run build && npx serve out -l 4173 &  then  node scripts/readme-media.mjs
// Needs: Playwright (Chromium), ffmpeg, gifsicle, and @mermaid-js/mermaid-cli (mmdc).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const OUT = 'docs/readme';
const TMP = join(OUT, '.tmp');
mkdirSync(TMP, { recursive: true });
const HIDE = `addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='[data-demo-guide]{display:none!important}';document.head.appendChild(s)})`;
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });
const lukki = readFileSync('public/icon.svg', 'utf8');

const browser = await chromium.launch();

/* ---------- banner (light + dark) and og.png ---------- */
const banner = (dark) => `<!doctype html><html><body style="margin:0">
<div style="width:1280px;height:640px;box-sizing:border-box;padding:72px 84px;font-family:Inter,sans-serif;position:relative;overflow:hidden;
  background:${dark ? 'radial-gradient(circle at 90% 10%,#1d4f78 0,transparent 45%),#0b1f2e' : 'radial-gradient(circle at 92% 6%,#8cc8f6 0,transparent 32%),linear-gradient(160deg,#fff,#eef5fc)'}">
  <div style="font-size:15px;letter-spacing:.32em;font-weight:600;color:${dark ? '#9fc3e0' : '#102C41'}">CSEN 909 HUMAN COMPUTER INTERACTION · GUC · WINTER 2026</div>
  <div style="font:800 118px 'Feather','Feather Bold',Inter;margin-top:120px;line-height:1"><span style="color:#4790CD">iLove</span><span style="color:${dark ? '#fff' : '#102C41'}">Tests</span></div>
  <div style="font-size:36px;margin-top:22px;color:${dark ? '#e3f0fb' : '#102C41'};font-weight:600">Find the gaps. Close the gaps.</div>
  <div style="font-size:22px;margin-top:14px;color:${dark ? '#9fc3e0' : '#5A6B7A'};max-width:700px">AI-assisted exam marking and learning-gap detection for Grades 1–5. The teacher confirms every step.</div>
  <div style="position:absolute;right:80px;bottom:70px;width:330px;height:330px">${lukki.replace('<svg', '<svg width="330" height="330"')}</div>
</div></body></html>`;
const p = await browser.newPage({ viewport: { width: 1280, height: 640 } });
for (const [dark, file] of [[false, 'banner-light.png'], [true, 'banner-dark.png']]) {
  await p.setContent(banner(dark)); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: join(OUT, file) });
}
await p.setContent(banner(false)); await p.screenshot({ path: 'public/og.png' });
for (const s of [192, 512]) {
  await p.setViewportSize({ width: s, height: s });
  await p.setContent(`<body style="margin:0">${lukki.replace('<svg', `<svg width="${s}" height="${s}"`)}</body>`);
  await p.screenshot({ path: `public/icon-${s}.png`, omitBackground: true });
}
await p.close();

/* ---------- GIF clips recorded from the real app ---------- */
let storage;
async function clip(name, size, steps) {
  const ctx = await browser.newContext({ viewport: size, recordVideo: { dir: TMP, size }, storageState: storage });
  await ctx.addInitScript(HIDE);
  const page = await ctx.newPage();
  await steps(page, (ms) => page.waitForTimeout(ms));
  storage = await ctx.storageState();
  const video = page.video(); await ctx.close();
  const webm = await video.path();
  const pal = join(TMP, 'pal.png'), raw = join(TMP, name + '-raw.gif');
  const vf = 'fps=8,scale=680:-1:flags=lanczos';
  run('ffmpeg', ['-v', 'error', '-y', '-ss', '0.6', '-i', webm, '-vf', `${vf},palettegen=stats_mode=diff`, pal]);
  run('ffmpeg', ['-v', 'error', '-y', '-ss', '0.6', '-i', webm, '-i', pal, '-lavfi', `${vf}[x];[x][1:v]paletteuse=dither=none`, raw]);
  run('gifsicle', ['-O3', '--lossy=80', raw, '-o', join(OUT, name + '.gif')]);
}
const T = { width: 1280, height: 760 }, S = { width: 760, height: 800 };
const btn = (pg, n) => pg.getByRole('button', { name: n }).first();

await clip('hand-in', S, async (pg, w) => {
  await pg.goto(BASE + '/student/hand-in/'); await w(900);
  await btn(pg, 'Next: take photos').click(); await w(700);
  for (let i = 0; i < 2; i++) { await btn(pg, /Take photo of page/).click(); await w(700); }
  await btn(pg, 'Next: check my pages').click(); await w(1800);
  await btn(pg, 'Take page 2 again').click(); await w(500);
  await btn(pg, /Take photo of page/).click(); await w(700);
  await btn(pg, 'Next: check my pages').click(); await w(900);
  await btn(pg, 'Next: send').click(); await w(500);
  await btn(pg, 'Send to Mrs Rasha').click(); await w(1500);
});
await clip('check-and-grade', T, async (pg, w) => {
  await pg.goto(BASE + '/teacher/check/?sub=nour-frac'); await w(1200);
  await pg.locator('#ocr').pressSequentially('42', { delay: 200 }); await w(400);
  await btn(pg, /Save correction/).click(); await w(700);
  await pg.locator('#ocr').fill(''); await pg.locator('#ocr').pressSequentially('6/9 = 2/3', { delay: 90 }); await w(300);
  await btn(pg, /Save correction/).click(); await w(500);
  for (let i = 0; i < 3; i++) { await btn(pg, /Correct, next/).click(); await w(350); }
  await btn(pg, /Send to AI grading/).click(); await w(1500);
  await pg.getByLabel(/history/).check(); await w(1600);
  await btn(pg, /Confirm AI marks/).click(); await w(900);
});
await clip('red-flag', T, async (pg, w) => {
  await pg.goto(BASE + '/teacher/grade/?sub=nour-frac'); await w(600);
  for (const q of ['Q3', 'Q1', 'Q4', 'Q5']) { await btn(pg, new RegExp(q)).click(); await w(250); const b = btn(pg, /Confirm (AI|my) marks/); if (await b.count()) await b.click(); await w(250); }
  await btn(pg, 'Confirm all grades').click(); await w(1500);
  await btn(pg, 'Confirm and send practice').click(); await w(900);
  await pg.getByRole('tab', { name: /Timeline/ }).click(); await w(1600);
  await pg.getByRole('tab', { name: /Class-wide/ }).click(); await w(700);
  await btn(pg, 'Announce to Year 4B').click(); await w(1200);
  await pg.goto(BASE + '/teacher/release/'); await w(700);
  await btn(pg, /^Release 1/).click(); await w(1200);
});
await clip('feedback-and-practice', S, async (pg, w) => {
  await pg.goto(BASE + '/student/results/'); await w(1800);
  await btn(pg, /How to fix it/).click(); await w(1500);
  await pg.goto(BASE + '/student/practice/'); await w(900);
  const bars = pg.locator('main button');
  for (const k of [0, 1, 0]) { await bars.nth(k).click(); await w(900); await pg.locator('main button').last().click(); await w(600); }
  await w(1200);
});

/* ---------- stills ---------- */
const still = async (url, size, file) => {
  const ctx = await browser.newContext({ viewport: size, storageState: storage, deviceScaleFactor: 1 });
  await ctx.addInitScript(HIDE);
  const pg = await ctx.newPage(); await pg.goto(BASE + url); await pg.waitForTimeout(700);
  await pg.screenshot({ path: join(OUT, file) }); await ctx.close();
};
await still('/', T, 'landing.png');
await still('/teacher/', T, 'teacher-home.png');
await still('/teacher/students/', T, 'red-flags.png');
await still('/teacher/audit/', T, 'audit-trail.png');
await still('/student/', S, 'student-home.png');
await still('/parent/', S, 'parent-digest.png');
await browser.close();

/* ---------- workflow diagram (light + dark) ---------- */
for (const [theme, bg, file] of [['default', 'white', 'workflow-light.png'], ['dark', '#0d1117', 'workflow-dark.png']]) {
  run('mmdc', ['-i', 'scripts/readme/workflow.mmd', '-o', join(OUT, file), '-t', theme, '-b', bg, '-w', '1400']);
}
rmSync(TMP, { recursive: true, force: true });
console.log(readdirSync(OUT).join('\n'));
