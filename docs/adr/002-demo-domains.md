# ADR 002: Four demo apps as polar-opposite themes

- **Status:** Accepted
- **Date:** 2026-11-07
- **Linear:** LAB-172

## Context

The plan used one invented business domain (orders, invoices, approvals) for every demo: the component catalog (LAB-152), the replay prompts (LAB-125), the eval suite (LAB-131) and the Workflow journey (LAB-170).

Invoicing was the wrong choice for a showcase:

- **Not relatable.** Visitors have to imagine why they'd care about an approval card.
- **Visually flat.** Tables and forms leave little room for imagery, colour or motion, which is where a design system shows its range.
- **One look.** A single domain hides the strongest claim the system makes: the same components can become very different products by changing tokens alone.

## Decision

Replace the single domain with **four demo apps** that run on the same components and semantic tokens. Each has its own brand, and the brands are chosen to be as far apart as possible.

| Demo | Brand | Palette | Radius | Font | Motion |
| --- | --- | --- | --- | --- | --- |
| **Travel planner** | Modern | Clean neutrals, one confident accent, photo-led | Medium | Geometric sans | Calm: shared-element card expands, route lines drawing on a map |
| **Music library curator** | Synthwave | Neon magenta and cyan on deep purple, glow | Small, sharp | Bold display face | Expressive: glow pulses, waveform and transport animation |
| **Recipe app** | Oatmeal & Ink | Warm paper tones, ink-dark text, one muted accent | Soft | Serif for titles and body | Gentle: page-turn steps, timer rings |
| **SaaS dashboard** | Dark analytics | Deep navy surfaces, neon gradient data (cyan, magenta, violet) | Large, rounded panels | Clean sans with tabular numbers | Data: counters ticking up, chart lines and rings drawing in |

Rules:

1. **A brand changes only the theme knobs** (primary, secondary and highlight seed colours, neutrals, `theme.radius`, `theme.font.*`; see LAB-173) plus motion tokens. If a demo seems to need a component change to look right, the component is missing a token. Add the token, not a fork.
2. **Components are generic.** "Itinerary timeline" is a `Timeline`, "crate grid" is a `MediaGrid`, "KPI ring" is a `Stat` with a `Progress` ring. Each demo composes them as **patterns** rather than defining its own components.
3. **Every brand passes the contrast gate** in each mode it supports. Synthwave and Dark analytics may be dark-only, and say so in their brand file.
4. **Each demo has one hero flow** the agent can generate and the Workflow journey can record:

| Demo | Hero flow | Components it needs (beyond Phase 1) |
| --- | --- | --- |
| Travel planner | Build a trip itinerary and vote on options | Timeline, MediaCard, Tabs, Avatar group, Poll, Toast |
| Music library curator | Curate a crate and play through it | MediaList with artwork, Transport bar, MediaGrid, Slider, Tooltip |
| Recipe app | Plan the week and cook a recipe step by step | Checklist, Stepper with Timer, Calendar grid, Tabs |
| SaaS dashboard | Read the week's metrics and drill into one | Stat with Progress ring, Chart panel (line, bar, area with gradient fills), Activity feed, Switch |

The Workflow journey (LAB-170) records the travel planner's trip itinerary card.

## Consequences

- LAB-145 builds four brands (plus high contrast) instead of a "second brand". LAB-152 lists components by demo. LAB-125, LAB-131 and LAB-170 use the new domains.
- The token pipeline must build several brands and run the contrast gate per brand × mode (LAB-145).
- The showcase can put two or more demos side by side on one page: `data-brand` re-derives tokens per subtree (LAB-173).
- More components than the invoicing plan needed. The catalog target (about 25) stays, but the mix shifts towards media, data visualisation and motion.
- Four brands mean four times the visual snapshots. Planned (LAB-143, not set up yet): Chromatic runs a subset of brand × mode on PRs and everything on release.

## When to revisit

- If a demo can't reach its look through the knobs and motion alone, decide whether the knobs need to grow (for example a surface texture or gradient stops) or the demo should change.
- If snapshot cost or build time grows past budget, drop to three demos.
