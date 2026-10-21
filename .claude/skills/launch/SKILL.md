---
name: launch
description: Use this skill when asked to run, start, dev-serve, or preview ui, or to confirm a change works in the real app. Covers the tsup watch build for packages/ui paired with the apps/playground Vite app used to exercise exported components.
---

# Launch ui

Turborepo internal-packages repo with no runnable frontend of its own — `packages/ui`
is a component library, not an app. The one genuine "launch" target is
`apps/playground`, a small Vite app that imports `@behindthemusictree/ui` and is used
to manually exercise exported components. `pnpm dev` at the repo root runs `packages/ui`'s
`tsup --watch` build in parallel with the playground's Vite dev server via Turborepo.

## 1. Install

```bash
pnpm install
```

## 2. Start the dev environment

```bash
pnpm dev
```

This is `turbo run dev`, which (per `turbo.json`, `dev` is `cache: false` and
`persistent: true`) runs both workspace `dev` scripts concurrently:

- `packages/ui`: `tsup --watch` — rebuilds the library on every source change.
- `apps/playground`: `vite` — dev server that consumes the workspace `@behindthemusictree/ui`
  package, printing its own local URL (Vite's default is `http://localhost:5173`).

## 3. Verify

Open the printed playground URL. Since `apps/playground` depends on
`@behindthemusictree/ui` as a `workspace:*` package and `tsup --watch` is rebuilding
it live, edits to `packages/ui` source should hot-reload into the playground without
restarting anything.

Note: this package does not ship `@behindthemusictree/brand`'s `tokens/theme.css` —
if playground styling looks off, check that the playground itself imports the design
tokens (see `apps/playground/src`), since `packages/ui` components only reference the
CSS custom properties, they don't define them.
