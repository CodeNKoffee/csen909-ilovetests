# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [semantic versioning](https://semver.org).

## [Unreleased]

## [1.1.0] - 2026-11-14

### Changed
- Student portal redesign, closer to "Duolingo for the kid": rounded Feather/Nunito headings, chunky pressable buttons and tiles, a tab bar that stays in reach, a soft sky backdrop around the phone on wide screens. Palette, no-red rule and contrast rules from Phase 1 are unchanged; sun yellow is added for stars only.
- Home: one hero card per state (due, being checked, back), a "where is my quiz" tracker, a practice card when Mrs Rasha recommends one, and the Gap Map as a learning path with a connecting trail.
- Hand-in: tips for a clear photo, a camera viewfinder with page counter, page thumbnails with status, a short "Lukki is checking" step, and a celebration after sending.
- Results: score ring, "You're great at" and "Let's practise" chips, full question text with marks per question, and "How to fix it" showing each mark-scheme step the pupil did or has not done yet.
- Practice: pick, then Check; feedback panel with a "same-size pieces" drawing of the tip; the answer is not given away after a miss; Play again.
- Progress: score chart with a list view and a tap or hover readout, and skill levels in words.

### Added
- Messages sheet behind the bell (was a link back to Home), with class notes.
- "My photos" now opens the device's photos and runs a simple sharpness check in the browser.

### Fixed
- Reloading Hand in after sending no longer restarts the wizard.
- The student tab bar stays on screen on phones instead of sitting below the content.
- Gap Map topics no longer overlap or spill past the right edge.

## [1.0.1] - 2026-11-14

### Changed
- "Confirm all grades" stays off until every answer is reviewed. A separate, explicit teacher action confirms the remaining answers and is logged.
- "Not in the mark scheme" sends the answer to the teacher. It blocks confirmation until she decides, and batch confirmation skips it.
- Drafts (assistant) and confirmed grades (teacher) are separate states with separate progress.
- The audit trail names the real actor, logs sign-ins, and the wording says which events it records.
- The tablet photo button opens a real file picker. Chosen photos get a simple sharpness check and stay on the device.
- The parent view shows results and practice only after release. The check screen labels the sample text as demo data.
- Lukki was redrawn, and the README media, icons and social image were regenerated.
- HTD 1 to 4 corrected: retake loop, owner labels and states, practice vs release, step 2.1.

## [1.0.0] - 2026-11-11

### Added
- Student view: Home with Lukki, 4-step photo hand-in wizard with a blur check, results with per-question feedback, practice and progress.
- Teacher view: batch overview, text check (least certain first, English and German), AI-suggested marks per mark-scheme step with confirm or override, history switch, comments, red flags with evidence, Learning Timeline, Concept Links, class-wide mistakes, release and audit trail.
- Assistant role: checks text and drafts grades; cannot confirm, decide red flags or release.
- Parent view (bonus): weekly digest of confirmed results.
- Demo guide and Reset demo for testers.
- README media script, user guide in `docs/wiki/`, SEO and sharing files, security headers.

[Unreleased]: https://github.com/CodeNKoffee/csen909-ilovetests/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/CodeNKoffee/csen909-ilovetests/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/CodeNKoffee/csen909-ilovetests/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/CodeNKoffee/csen909-ilovetests/releases/tag/v1.0.0
