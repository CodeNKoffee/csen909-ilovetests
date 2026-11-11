# Contributing to iLoveTests

| | |
|---|---|
| Live app | [ilovetests.hatemsoliman.dev](https://ilovetests.hatemsoliman.dev) |
| Repository | [github.com/CodeNKoffee/csen909-ilovetests](https://github.com/CodeNKoffee/csen909-ilovetests) |
| User guide | [Wiki](https://github.com/CodeNKoffee/csen909-ilovetests/wiki) |
| Report a bug | [New bug report](https://github.com/CodeNKoffee/csen909-ilovetests/issues/new?template=bug_report.md) |
| Suggest a feature | [New feature request](https://github.com/CodeNKoffee/csen909-ilovetests/issues/new?template=feature_request.md) |
| Open issues | [Issues](https://github.com/CodeNKoffee/csen909-ilovetests/issues) · [good first issues](https://github.com/CodeNKoffee/csen909-ilovetests/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) |
| Pull requests | [Pull requests](https://github.com/CodeNKoffee/csen909-ilovetests/pulls) |
| Security problem | [Report privately](https://github.com/CodeNKoffee/csen909-ilovetests/security/advisories/new), never in a public issue |
| What changed | [CHANGELOG.md](CHANGELOG.md) · [Releases](https://github.com/CodeNKoffee/csen909-ilovetests/releases) |
| Licence | [MIT](LICENSE) |
| Maintainer | [Hatem Soliman](https://hatemsoliman.dev) |

Thanks for helping. iLoveTests started as a team project for CSEN 909 Human Computer Interaction at the German University in Cairo. Team members and reviewers are welcome to open issues and pull requests.

## Ground rules

- The teacher stays in control. No change may let the AI, or an assistant, confirm grades, decide red flags or release results.
- No real pupil data. Use the fictional pupils in `lib/data.ts`.
- Kind to children. No red or green, no crosses, praise before corrections.
- Be respectful. See the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to help

- Try the [live app](https://ilovetests.hatemsoliman.dev) with the demo guide and report anything confusing.
- Fix a [good first issue](https://github.com/CodeNKoffee/csen909-ilovetests/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
- Improve the [user guide](docs/wiki/), which is published to the wiki.

## Local setup

1. [Fork the repo](https://github.com/CodeNKoffee/csen909-ilovetests/fork) and clone your fork.
2. Install Node.js 20 or newer, then:

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Before you open a pull request

- [ ] `npm run build` passes with no type errors.
- [ ] You clicked through all 8 demo steps, on a laptop and at phone width.
- [ ] No console errors.
- [ ] Screens you changed still read well for a Grade 4 pupil.
- [ ] One line added under **Unreleased** in [CHANGELOG.md](CHANGELOG.md).
- [ ] README media regenerated if the screens changed (see the README).

## Style

- TypeScript and React function components, one job per file.
- Tailwind utility classes with the colour tokens in `app/globals.css` (navy, azure, sky, ice, tint, cream, rule, muted).
- Plain, short copy. Name things the way teachers and pupils do.

## Versions and tags

We use [semantic versioning](https://semver.org). Each release gets one annotated tag (`v1.0.0`), a matching section in [CHANGELOG.md](CHANGELOG.md) and a GitHub release. Contributors only add lines under **Unreleased**; the maintainer moves them into a version section when tagging.
