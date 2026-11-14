# ui

`@behindthemusictree/ui` — generic, business-logic-free UI components for BehindTheMusicTree
React apps. Extracted from `@behindthemusictree/app-kit`'s `./ui` subpath so the design-system
layer can be versioned independently from `app-kit`'s auth/transport/player/genre-tree plumbing.

## Package

See [`packages/ui`](packages/ui). Published to npm as `@behindthemusictree/ui`:

```tsx
import { Button, Input, Table, Skeleton, Pagination, RingLoader, IconTextButton, UploadButtons, PanelSection, DetailPanel, PanelEdgeTab, useObscuredInset, FieldList, Chip, Page, Field, Label, Select, Textarea, Checkbox, Card, Alert, EmptyState, TextLink, cn } from "@behindthemusictree/ui";
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
`--color-neutral-{100,200,300,700}`, `--color-red-{600,700}`, `--color-green-600` and, on touch screens, `--layout-touch-target`. `DetailPanel` also reads the `--layout-*` panel tokens (`--layout-panel-edge`, `--layout-sheet-peek`, `--layout-panel-aside-w`, `--layout-center-*`), which need brand ≥ 12.10. `Page` reads `--layout-page-max-w`, `--layout-page-max-w-narrow`, `--layout-gutter`, `--layout-band-top` and `--layout-panel-gap`, and the form components read `--color-surface`, `--color-surface-muted`, `--color-border`, `--color-text`, `--color-text-muted` and `--color-focus-ring`; the page width tokens need brand ≥ 12.13. Load `@behindthemusictree/brand/styles` to give `body` its background and text colour.

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
tags, and pushes — which triggers `.github/workflows/publish.yml` to publish the version on npm.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

`DetailPanel` accepts a `cover` slot for a full-width image above its body. With `titleInSearch`, the cover starts at the panel’s top edge behind the host’s floating search field; header controls remain overlaid and the title remains available to assistive technology. Put image credits in the body.

Run `pnpm test:browser` after `pnpm build` for Chromium panel layout regressions (install the browser with `pnpm exec playwright install chromium`). The playground fixture is available at `/?panelCover`; `expanded`, `tall` and `noCover` query flags exercise its variants.

### Host-specific detail panel placement

`useObscuredInset` normally follows the `DetailPanel` sheet and side props. If a host changes
panel placement through responsive CSS, set `--detail-panel-obscured-edge` to `left`, `right`
or `bottom` in those same rules (on the panel or an ancestor). The hook then measures the
actual panel rectangle against that edge, including expanded panels. Collapsed panels
still report no inset. Leave the property unset to retain the standard responsive layout.
Invalid nonempty values throw. Insets update when the panel or its canvas resizes and when
panel transitions finish.
