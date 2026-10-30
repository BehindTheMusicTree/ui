# 🧭 Contributing Guidelines

Thank you for your interest in contributing to `@behindthemusictree/ui`!

This package is consumed by `@behindthemusictree/app-kit` (and, through it, transitively by
`grow-the-music-tree-frontend` and `hear-the-music-tree-frontend`). Changes here have a wide blast
radius, so please keep that in mind.

## Table of Contents

- [Contributors vs Maintainers](#contributors-vs-maintainers)
- [Development Workflow](#development-workflow)
  - [1. Fork \& Clone](#1-fork--clone)
  - [2. Environment Setup](#2-environment-setup)
  - [3. Branching](#3-branching)
  - [4. Developing](#4-developing)
  - [5. Verifying](#5-verifying)
  - [6. Committing](#6-committing)
  - [7. Pull Request Process](#7-pull-request-process)
  - [8. Releasing _(For Maintainers)_](#8-releasing-for-maintainers)
- [License \& Attribution](#license--attribution)

## Contributors vs Maintainers

**Contributors** can submit bug reports/feature requests via GitHub Issues, open pull requests,
improve documentation, and participate in discussions.

**Maintainers** review and merge pull requests, cut releases, and manage the publish workflow
(`.github/workflows/publish.yml`, which stages each version on npm via trusted publishing — no token — for a maintainer to approve with 2FA).

## Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR-USERNAME/ui.git
cd ui
```

Maintainers can clone directly:

```bash
git clone https://github.com/BehindTheMusicTree/ui.git
cd ui
```

### 2. Environment Setup

Requirements:

- **Node.js 20.x or higher**
- **pnpm** (see `packageManager` in `package.json` for the pinned version)

```bash
pnpm install
```

### 3. Branching

Branch from `main`: `feature/<short-description>`, `fix/<short-description>`,
`chore/<short-description>`.

### 4. Developing

```bash
pnpm dev     # tsup --watch on packages/ui + apps/playground running in parallel
```

`apps/playground` is a small Vite app for manually exercising exported components — use it to
sanity-check UI changes before opening a PR.

This package must stay free of business logic: no auth, transport, or domain-specific (track,
genre...) code. If a component needs that kind of dependency, it belongs in
`@behindthemusictree/app-kit` instead, consuming this package's primitives.

### 5. Verifying

```bash
pnpm build   # tsup: ESM + CJS + .d.ts
pnpm lint    # tsc --noEmit across the workspace
```

Both must pass before opening a PR. There is no test suite yet — until one exists, `pnpm build`
(which runs the DTS build) is the primary type-safety check.

### 6. Committing

Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`,
`docs:`, `refactor:`) — the release script's changelog entries and the semver bump both key off
the change being clearly described.

### 7. Pull Request Process

1. Ensure `pnpm build && pnpm lint` pass locally.
2. Open a PR against `main` describing what changed and why.
3. Add a bullet to `CHANGELOG.md` under `[Unreleased]` for any user-facing change (new export,
   behavior change, breaking change).

### 8. Releasing _(For Maintainers)_

```bash
pnpm release -- patch   # or minor / major
```

This bumps `packages/ui/package.json`'s version, moves the `CHANGELOG.md` `[Unreleased]` section
under the new version heading, commits, tags (`vX.Y.Z`), and pushes — which triggers
`.github/workflows/publish.yml` to build `@behindthemusictree/ui` and stage it on npm (trusted
publishing, with provenance). The version goes live only once an npm owner approves it with 2FA:
`npm stage list @behindthemusictree/ui`, then `npm stage approve <stage-id>` (pass
`--registry https://registry.npmjs.org` if your `~/.npmrc` maps the scope elsewhere). Must be run
from a clean `main` branch.

## License & Attribution

By contributing, you agree your contributions are licensed under this repository's
[LICENSE](LICENSE).
