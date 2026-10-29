# CLAUDE.md

`@behindthemusictree/ui` — generic, business-logic-free styled primitives (Button, IconButton, Input, SegmentedControl, Chip, Table…). This repo owns their sizes, touch targets and focus rings. Consumed by `app-kit-ui`, grow and hear.

Ecosystem map (which repo owns what, where UI changes go): `~/git/claude-config/CONVENTIONS.md` § Ecosystem.

- Source: `packages/ui/src`. Colors, spacing and radii come from `@behindthemusictree/brand` tokens (`~/git/the-music-tree-brand`) — never hard-code them.
- No auth, transport or domain (track/genre) logic.
- Validate: `pnpm build && pnpm lint` (no test suite yet).
- Branching, commits, PRs and releases: `CONTRIBUTING.md`. Record changes under `[Unreleased]` in `CHANGELOG.md`.
