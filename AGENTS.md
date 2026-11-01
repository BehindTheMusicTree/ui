# Project guidance

`@behindthemusictree/ui` provides generic, styled React primitives without
business logic. It owns primitive sizing, touch targets and focus rings; app-kit-ui,
Grow and Hear consume it. Source lives in `packages/ui/src`.

Use the `@behindthemusictree/brand` tokens for colors, spacing and radii. Keep
authentication, transport and domain-specific behavior in the appropriate
consumer or shared business-logic package.

Read `CONTRIBUTING.md` for branching, validation and releases. Feature work
branches from `main` and targets `main` through a PR. Record user-facing changes
in `CHANGELOG.md` under `[Unreleased]`.

`pnpm build` and `pnpm lint` validate the workspace. `pnpm test` currently only
prints `no tests yet`; it is not a behavioral test suite. For visual checks use
the project launch skill in `.agents/skills/launch/SKILL.md`, shared with Claude
through `.claude/skills/launch`.
