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
(`.github/workflows/publish.yml`, which publishes each version on npm via trusted publishing — no token).

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
pnpm test    # Vitest component tests
```

All must pass before opening a PR.

### 6. Committing

Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`,
`docs:`, `refactor:`) for the pull request title. Squash merges use that title as the commit
subject, which determines the next release version and changelog entry.

### 7. Pull Request Process

1. Ensure `pnpm build && pnpm lint` pass locally.
2. Open a PR against `main` describing what changed and why.
3. Give it a Conventional Commit title (checked by `pr-title.yml`). Do not edit `CHANGELOG.md`:
   release-please generates it.

### 8. Releasing _(For Maintainers)_

On pushes to `main`, `publish.yml` validates release intent using
`.github/release-policy.json`. When a version increases, CI creates an annotated
`vX.Y.Z` tag, verifies the exact tagged commit, and publishes the built package
with npm provenance. It creates the GitHub Release after npm succeeds. On retry,
an existing npm version is accepted only when its SHA-512 integrity matches the
newly packed artifact. Use **Re-run failed jobs** to retry publication.

Release-please reconciles after successful publication and on ordinary pushes.
It opens or updates a release PR with the package version, root changelog and
release manifest. The PR squash-merges after the required checks pass. Keep the
private workspace root at `0.0.0`. CI owns release tags.

## License & Attribution

By contributing, you agree your contributions are licensed under this repository's
[LICENSE](LICENSE).
