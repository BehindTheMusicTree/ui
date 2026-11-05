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

All must pass before opening a PR. Release preparation and recovery fixtures also run in CI.

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

Run this on a clean task branch from `main`, after filling `[Unreleased]`. It prepares
`packages/ui/package.json`, the lockfile and the versioned changelog section. Review and
commit these changes, then open a PR to `main`. It does not commit, tag or push.

After an approved version bump merges, `.github/workflows/release-tag.yml` creates an
annotated tag on that exact commit using the shared release App. A merge without a bump,
including the initial migration, creates no tag. The contract is `.github/release-policy.json`.
The organization must provision `RELEASE_APP_ID` and `RELEASE_APP_PRIVATE_KEY` and activate
the selected repository and immutable tag protections through `github-config` first.

The existing `.github/workflows/publish.yml` keeps its npm trusted publisher identity and
publishes npm before the GitHub Release. Rerun the failed tag run after fixing a transient
failure: an existing npm artifact is accepted only when its name, version and archive
integrity match. Registry errors or a different archive fail explicitly. Never move a tag
or bump again to repair a partial publication. Investigate non-reproducible archives before
resuming. GitHub Release notes use the version's changelog section.

## License & Attribution

By contributing, you agree your contributions are licensed under this repository's
[LICENSE](LICENSE).
