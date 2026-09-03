# Changelog

All notable changes to `@behindthemusictree/ui` are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Dev tooling**: Added a `launch` Claude Code skill (`.claude/skills/launch/`) documenting how to start the local dev environment.

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
