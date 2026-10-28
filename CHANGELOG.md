# Changelog

All notable changes to `@behindthemusictree/ui` are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
