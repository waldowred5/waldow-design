# Chromatic visual tests

Chromatic's free plan allows 5,000 billed snapshots a month. When it runs out, Chromatic pauses testing until the month resets. Work here lands as stacked PRs, and one push gets merged up through every branch above it. If every PR got a real build, a single busy week would use the whole month. So `.github/workflows/chromatic.yml` runs a real build only where a review matters.

## When a real build runs

| Trigger | Real build? |
| --- | --- |
| Push to `main` | Yes. Changes are auto-accepted and become the baselines. |
| PR whose base is `main` (opened, pushed, reopened, marked ready) | Yes, unless it only touches docs (see below) |
| Stacked PR retargeted onto `main` | Yes. The `edited` event with a base change triggers it. |
| Any PR labelled `visual-test` | Yes, on every push while the label is on |
| Manual run (Actions → Chromatic → Run workflow) | Yes, on the chosen branch |
| Stacked PR (base is another branch) | Skipped |
| Draft PR | Skipped until it's marked ready |
| PR into `main` that only changes `docs/`, `*.md`, `.changeset/`, `.claude/`, `.github/` (except this workflow) or `LICENSE` | Skipped |

A skipped run still calls Chromatic with `skip: true`. This bills no snapshots and uploads no Storybook, but it marks the commit as passing, so the required **UI Tests** check still reports and nothing waits forever. The job summary says which branch was taken and why.

Superseded runs on the same PR are cancelled. Runs on `main` queue instead, so every baseline lands.

## Asking for a visual test on a stacked PR

- **Label the PR `visual-test`.** Adding the label starts a real build, and every push while it's on runs one too. Remove the label when you're done, because each merge-up push costs snapshots while it's on.
- **Or run it once by hand:** Actions → Chromatic → Run workflow, and pick the PR's branch.

Use this when you want a hosted Storybook link to share, such as for comparing prototype variants.

## Cost per build

A full build is about 136 billed snapshots: 68 stories × (1 visual + 1 accessibility snapshot). There's one browser and no modes. MDX docs pages aren't snapshotted. TurboSnap (`onlyChanged`) re-captures only the stories a change affects. It copies the rest at 0.2 of a snapshot each, so they cost less but aren't free. A build is free only when nothing in any story's dependency graph changed, and that never happens on a merge commit.

Changes to `.storybook/` config, or to anything `preview.tsx` imports (such as `styles.css` and the tokens), re-capture every story.

## Merging a stack cheaply

The usual bottom-up merge costs about two real builds per PR: one when the PR is retargeted onto `main`, and one for the push to `main`. To spend less, merge the stack top-down into its bottom branch first. Merges between stacked branches are skipped, so only the bottom PR and the push to `main` run real builds.

## Sources

- Billing: <https://www.chromatic.com/docs/billing/>
- TurboSnap: <https://www.chromatic.com/docs/turbosnap/>
- CLI options (`skip`, `onlyChanged`, `externals`, `untraced`, `onlyStoryFiles`): <https://www.chromatic.com/docs/configure/>
- GitHub Action: <https://www.chromatic.com/docs/github-actions/>
