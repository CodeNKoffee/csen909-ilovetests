# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [semantic versioning](https://semver.org).

## [Unreleased]

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

[Unreleased]: https://github.com/CodeNKoffee/csen909-ilovetests/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/CodeNKoffee/csen909-ilovetests/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/CodeNKoffee/csen909-ilovetests/releases/tag/v1.0.0
