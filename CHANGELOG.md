# Changelog

All notable changes to `@behindthemusictree/ui` are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.25.0] - 2026-11-13

### Added

- `DetailPanel.cover`: full-width cover content that scrolls with the body and starts behind a floating search field when `titleInSearch` is set.

- `SearchCombobox` accepts a trailing action in place of its search indicator, optionally restricted to screens below `sm` or `md`, while keeping Clear and loading feedback available.

## [0.24.0] - 2026-11-12

### Added

- `FloatingToggle`: single-cell floating card with an `aria-pressed` icon button, the on/off counterpart of the `floating` `SegmentedControl`, for placing beside `ZoomControls`.

### Changed

- `floatingControlCellStateClassName` in `floating-control.ts` now holds the selected/unselected cell styles shared by `SegmentedControl` and `FloatingToggle`.

## [0.23.0] - 2026-11-12

### Added

- `StepList`: ordered list of steps with `pending | current | done | failed` status icons, `aria-current="step"` on the current step, an optional per-step detail and consumer-supplied screen-reader status labels.

## [0.22.0] - 2026-11-12

### Added

- `Page` (document and canvas layouts, default/narrow/full width, title, description and actions slots) for pages that sit under the floating navigation band.
- Form components `Label`, `Field` (wires `id`, `aria-describedby` and `aria-invalid` for hint and error), `FieldError`, `Select`, `Textarea` and `Checkbox`; `Input`, `Select` and `Textarea` share `input-base.ts`.
- Content components `Card`, `Alert` (`info | error | success`), `EmptyState` and `TextLink` with an exported `textLinkClassName` for framework links.

### Changed

- `Table` uses the brand surface and border tokens instead of the undefined `bg-muted`, `text-muted-foreground` and default border colour, so row hover and footer styles now render.
- `Input` shows a red border while `aria-invalid="true"` (set by `Field` on error).
- Requires `@behindthemusictree/brand` ^12.13.0 (page width tokens and base styles).
- `ActionBand` centers its buttons, in the main row and in the titled section; the section title stays left-aligned.

### CI

- Pin the shared release workflows to the lag-tolerant github-workflows commit 79c1362, so tag creation tolerates GitHub read-after-write delays.

## [0.21.2] - 2026-11-10

### Added

- `LabelPlacementItem.dot` is optional: an item without it is no obstacle for other labels, for a mark drawn under the labels (faded context).
- `LabelPlacementItem.tier`: a placement band (default 0); every item of a higher tier is placed before any lower one, whatever their priorities.

### Changed

- `placeLabels` throws on a non-finite or inverted box, or a NaN priority or tier, instead of silently mis-placing labels (a NaN or infinite box never entered the index, an inverted one never overlapped anything). `±Infinity` priorities and zero-size boxes stay valid. A caller feeding NaN (for example a NaN rank from missing data) now gets an error naming the item rather than an unlabelled item.

## [0.21.1] - 2026-11-10

### Fixed

- `ActionBand` aligns its buttons on their top edge, so a button without a caption (such as Focus) no longer sits lower than the ones with a count.

### Changed

- `PanelSection` titles, `FieldList` labels and `ActionBand` section titles share one style, exported as `PANEL_LABEL_CLASS`, on the brand `caption` size. The `ActionBand` section title aligns on the panel margin (`px-panel-x`). The gap between a title and its content is the same in all three (`PANEL_LABEL_CONTENT_GAP_CLASS`); `FieldList` rows grow by 4px.

## [0.21.0] - 2026-11-10

### Changed

- **Breaking:** the `DetailPanel` body (and each column in aside mode) now sets the horizontal margin (`px-panel-x`) and the vertical gap between its direct children (`gap-panel-gap`); the header uses `px-panel-x`. `PanelSection` and `FieldList` no longer carry their own padding, so content must drop its section-level horizontal and vertical padding or the margin doubles. `ActionBand` and anything else that must touch the panel edges now needs a `PanelBleed`; in aside mode `bodyClassName` still targets the outer grid, not the columns. Requires brand `^12.12.0`.

### Added

- `cn` knows the brand `panel-x` and `panel-gap` spacing keys, so overriding them through `className` works.
- `PanelBleed`: cancels the body margin so a divider, band or border touches the panel edges; `padded` re-applies the margin inside.
- `PanelStack`: a wrapper that keeps the panel gap between its children, for content that needs a root element.
- `ActionBand` and `ActionButton`: a vertically centered row of icon buttons with an optional caption (such as a playable count), disabled state and tooltip, plus an optional titled section.

## [0.20.0] - 2026-11-09

### Changed

- Type roles from `@behindthemusictree/brand` 12.11: `Combobox` input uses `text-input`, `SearchCombobox` uses `text-search` and keeps `--layout-search-h` on coarse pointers, `DetailPanel` body uses `text-body` and its title `text-title`; the title-in-search padding uses `pt-search-clear`. Requires brand `^12.11.0`.
- `cn` knows the brand type roles, so a role no longer drops a text color (or the reverse).

## [0.19.0] - 2026-11-09

### Changed

- **Breaking:** `DetailPanel` replaces `hideTitle` and `hideClose` with `titleInSearch`. The header clears the floating search field by itself, and Escape and the sheet drag still close the panel.
- `IconButton` and the `SearchCombobox` icon buttons show focus with the hover background instead of a blue ring or the browser outline.

### Added

- `IconButton`: `lg` size.

## [0.18.0] - 2026-11-07

### Added

- `SearchCombobox`: a pill-shaped search field over `Combobox` with a search icon or spinner, an optional clear button and a `leading` action slot.

## [0.17.2] - 2026-11-07

### Fixed

- Give detail panel scroll areas a thin scrollbar using semantic theme colors.

## [0.17.1] - 2026-11-06

### Changed

- Halve the left padding of panel sections.

- Align detail panels with the top and bottom of their canvas and left-sided panels with its left edge.

### Fixed

- Preserve complete release notes when Markdown examples contain version headings.

## [0.17.0] - 2026-11-05

### Added

- `Breadcrumb`: the location trail floated over a canvas (tree, region map). It shows a home icon, the ancestors and the current item in the floating-control card. A long trail collapses its middle into a "…" button, which collapses again when the current item changes. Pass `onSelectCurrent` to make the current item clickable. It is unpositioned, like `ZoomControls`.

## [0.16.0] - 2026-11-05

### Added

- `labelHalo`, `labelHaloColor` and `LABEL_HALO_WIDTH_RATIO`: headless label contrast policy (black halo behind light text, white behind dark for white-text contrast, width proportional to font size) shared by the tree, genealogy and map views.

### Notes

- Prepare releases through PRs; CI owns immutable tags and resumable npm publication.

## [0.15.0] - 2026-11-05

### Added

- `DetailPanel` is now the single detail-panel shell: `headerStart`, `headerAccent`, `hideClose`, `hideTitle`, `expanded` + `aside` (two scrolling columns), `edgeTab`, `sheet` (bottom sheet with drag handle below `md`), `closeOnEscape` (leaves expanded mode first), `forwardRef` and `aria-labelledby`. The collapse transform moves the edge tab with the panel.
- `PanelEdgeTab` (moved here from app-kit-ui) and `useObscuredInset(ref)`, which reports how many px of the canvas a panel currently covers.
- Vitest, Testing Library and happy-dom; `pnpm test` now runs a suite.

### Changed

- **Breaking:** `DetailPanel` now defaults `sheet` and `closeOnEscape` to `true`, applies `className` to the inner `<aside>` (positioning lives on a new outer `<div>`), and its forwarded `ref` targets that outer `<div>`.
- `DetailPanel` positions itself with `--layout-panel-edge` (brand ≥ 12.10) instead of `--layout-gutter`.
- Peer dependency `@behindthemusictree/brand` is now `^12.10.0`.

## [0.14.0] - 2026-11-04

### Added

- `Combobox`: keyboard-accessible ARIA combobox with labelled option groups (Arrow keys, Home/End, Enter, Escape; picks on mouse-down), a live `status` line, `loading` and `empty` slots, and optional `onLoadMore`.

## [0.13.0] - 2026-11-04

### Added

- `SegmentedControl` `variant="floating"`: icon-only square cells in the same card as `ZoomControls`, so controls floated side by side over a canvas share one height. Both now take their chrome from a shared `floating-control` module.

## [0.12.0] - 2026-11-04

### Added

- `label-layout`: headless, DOM-free helpers for zoomable chart labels — `logScalePosition`, `isRankShownAtZoom`, `dotLabelCandidates` and a greedy collision-culling `placeLabels` — so views share one label mechanic and keep their own ranking policy.

### Changed

- Publish workflow: publish directly with `npm publish` instead of staging, so releases need no manual 2FA approval.

## [0.11.0] - 2026-11-02

### Changed

- Share project and playground guidance across Claude and Codex, with CI checking adapter consistency.
- `ZoomControls` defaults to `orientation="horizontal"`; pass `orientation="vertical"` to keep the column layout.

## [0.10.1] - 2026-10-30

### Changed

- Published to the public npm registry (trusted publishing, with provenance) instead of GitHub Packages: installing `@behindthemusictree/ui` no longer needs a token.

## [0.10.0] - 2026-10-29

### Added

- `ZoomControls`: zoom in / zoom out / fit-to-frame button cluster, vertical or horizontal, with an optional `leading` slot.
- `DetailPanel`: floating side panel (title, close, scrolling body) sized by the brand layout tokens, with a `collapsed` slide-out.

## [0.9.0] - 2026-10-29

### Changed

- Touch targets on coarse pointers (`@media (pointer: coarse)`): `Button` (every size, so `IconTextButton` too), `IconButton`, `SegmentedControl` options and `Input` grow to `--layout-touch-target` (44px); `Chip` keeps its look but gets a 44px-tall hit area. `Input` also switches to `text-base` there so iOS doesn't zoom on focus. `SegmentedControl` scrolls horizontally instead of overflowing when its options don't fit. Desktop sizes are unchanged.
- `@behindthemusictree/brand` peer range is now `^12.7.0` (for `--layout-touch-target`).

## [0.8.0] - 2026-10-29

### Added

- `Avatar`: round initials badge on green, with `getInitials(label)` (name or email → up to two letters).

## [0.7.0] - 2026-10-28

### Added

- `PanelGroup`: a titled group inside a `PanelSection` (e.g. Albums, Live).

### Changed

- Containers own their separators: `PanelSection` no longer draws its own top border (the panel holding it does), and `PanelSection` and `FieldList` draw a divider between their children (groups, fields).

## [0.6.0] - 2026-10-28

### Changed

- `PanelSection` always draws its top divider, matching the genre panel's sections. Dropping it on a first child left a section without a divider when a panel stacks its main and extra content.

## [0.5.0] - 2026-10-28

### Added

- **`PanelSection`**: collapsible detail-panel section (padded, divided, uppercase muted title toggle with `aria-expanded`), matching genre-tree-view's info-panel sections.
- **`FieldList`**: labelled `dl` of label/value facts in the same panel style.
- **`Chip`**: small rounded external-link pill with an optional icon.

## [0.4.0] - 2026-10-26

### Added

- `SegmentedControl` options accept `disabled` and `title`.

## [0.3.0] - 2026-10-26

### Added

- **`IconButton`**: round icon-only button (`sm` 24px, `md` 32px) with a required `aria-label`.
- **`SegmentedControl`**: single-choice toggle group (`aria-pressed` buttons) for view-mode switches.
- **Dev tooling**: Added a `launch` Claude Code skill (`.claude/skills/launch/`) documenting how to start the local dev environment.

### Changed

- `Input`, `Skeleton` and `RingLoader` read brand tokens (`--color-surface`, `--color-border`, `--color-text*`, `--color-focus-ring`, `--color-primary`) instead of unresolved shadcn classes or dark-surface colors; `Button`'s focus ring uses `--color-focus-ring`. Requires the semantic tokens from `@behindthemusictree/brand` after 12.0.0.

## [0.2.0] - 2026-10-21

### Added

- **Peer dependency**: `@behindthemusictree/brand` (`^12.0.0`) is now declared as an optional peer dependency, making the existing reliance on its CSS variables explicit. The README lists the variables read.

## [0.1.0] - 2026-08-14

### Added

- Initial extraction of `Button`, `IconTextButton`, `Input`, `Table`, `Skeleton`, `Pagination`,
  `RingLoader`, and `UploadButtons` out of `@behindthemusictree/app-kit`'s `./ui` subpath into a
  standalone, business-logic-free UI package — so a change of design-system component doesn't
  require bumping a package that also carries auth/transport/player/genre-tree plumbing, and vice
  versa.
- `Button` now forwards its ref (`forwardRef<HTMLButtonElement, ButtonProps>`), uses
  `class-variance-authority` for its `variant`/`size` styles instead of manually indexed style
  objects, and adds `disabled:` and `focus-visible:` styles (previously missing — a WCAG 2.4.7 gap
  given `disabled` is already used by consumers).
