#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--" ]]; then shift; fi
BUMP="${1:-}"
if [[ $# != 1 || ! "$BUMP" =~ ^(patch|minor|major)$ ]]; then
  echo 'Usage: pnpm release -- <patch|minor|major>' >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"
BRANCH=$(git branch --show-current)
if [[ -z "$BRANCH" || "$BRANCH" == main ]]; then
  echo 'Error: prepare a release on a task branch, then open a PR to main' >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Error: working tree must be clean before release preparation' >&2
  exit 1
fi

node scripts/release-utils.cjs check "$BUMP"
(cd packages/ui && npm version "$BUMP" --no-git-tag-version --ignore-scripts > /dev/null)
pnpm install --lockfile-only
node scripts/release-utils.cjs prepare
NEW_VERSION=$(node -p "require('./packages/ui/package.json').version")
printf 'Prepared v%s. Review the diff, commit it and open a PR to main.\n' "$NEW_VERSION"
