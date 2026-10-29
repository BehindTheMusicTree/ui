# ui

`@behindthemusictree/ui` — generic, business-logic-free UI components for BehindTheMusicTree
React apps. Extracted from `@behindthemusictree/app-kit`'s `./ui` subpath so the design-system
layer can be versioned independently from `app-kit`'s auth/transport/player/genre-tree plumbing.

## Package

See [`packages/ui`](packages/ui). Published to GitHub Packages as `@behindthemusictree/ui`:

```tsx
import { Button, Input, Table, Skeleton, Pagination, RingLoader, IconTextButton, UploadButtons, PanelSection, FieldList, Chip, cn } from "@behindthemusictree/ui";
```

This package contains **only** generic, stateless-or-self-contained UI components — no auth,
transport, or domain-specific (track/genre) logic. Business modules that assemble these primitives
into app features live in `@behindthemusictree/app-kit` (e.g. `popup`, `genre-tree`), which depends
on this package rather than the other way around.

Components are styled with Tailwind utility classes referencing CSS custom properties
(`--color-*`, `--space-*`, `--radius-*`). **Consumers must also load
`@behindthemusictree/brand`'s `tokens/theme.css`** — this package does not ship or import it.
`brand` is an optional peer dependency (`^12.7.0`): the app installs and owns its version. Outside
BTMT, define the variables yourself instead; the ones currently read are `--color-primary`,
`--color-neutral-{100,200,300,700}`, `--color-red-{600,700}`, `--color-green-600` and, on touch screens, `--layout-touch-target`.

## Development

```bash
pnpm install
pnpm dev     # builds the package in watch mode + runs apps/playground
```

`apps/playground` is a small Vite app for manually exercising exported components — not published.

## Release

```bash
pnpm release -- patch   # or minor / major
```

Bumps the package version, moves `CHANGELOG.md`'s `[Unreleased]` section under the new version,
tags, and pushes — which triggers `.github/workflows/publish.yml` to build and publish to GitHub
Packages.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.
