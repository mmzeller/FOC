# FOC Heat — Project Context

## Purpose
This project is a personal comic-book investment research system. The objective is **investment profit and risk-adjusted aftermarket appreciation**, not simply identifying good comics to read.

## Canonical repository
`mmzeller/foc`

The repository is the durable project memory. Do not rely on the length or availability of any single ChatGPT conversation.

## Core rules
1. FOC accuracy is the highest priority.
2. Never recommend a comic as an FOC buy if its actual FOC cutoff has already passed.
3. Verify FOC dates from current, credible sources. Prefer distributor/publisher/retailer FOC evidence and cross-check when possible.
4. Distinguish **Verified Facts**, **Market Evidence**, and **Investment Thesis**.
5. Never fabricate print runs, retailer order counts, pull-list counts, sales numbers, first appearances, scarcity, or market prices.
6. If a critical fact cannot be verified, explicitly mark it **Unknown**.
7. A good comic is not automatically a good investment.
8. Entry price is part of the investment thesis.
9. Demand relative to supply matters more than creator hype alone.
10. Do not confuse an asking price with a completed sale.
11. Treat ratio variants as potentially scarce, but never assume scarcity creates demand.
12. Track every recommendation and eventually classify it WIN / NEUTRAL / LOSS using actual market evidence.
13. Perform postmortems on misses as aggressively as successes.
14. Maintain a watchlist for books that are interesting but not yet buy recommendations.
15. Maintain a **Post-FOC Opportunity** list for books that were missed at FOC but may still be obtainable near cover price.
16. Be conservative when evidence is incomplete. It is better to recommend fewer books with stronger evidence.
17. Do not use false numerical precision. Prefer conviction levels and evidence grades over unsupported scores.
18. Investment recommendations must state a suggested quantity and the reason for that quantity.
19. Never hide uncertainty.
20. The user has explicitly prioritized investment first.

## Evidence grades
- **A:** Strong independent evidence supporting the thesis.
- **B:** Good thesis with one or more important evidence gaps.
- **C:** Mostly speculative; limited market evidence.
- **D:** Primarily hype-driven or unsupported.

## Recommendation states
- **BUY:** Evidence supports acquiring copies at the stated entry price.
- **WATCH:** Interesting thesis, but evidence or price is not strong enough yet.
- **PASS:** Insufficient investment case.
- **POST-FOC:** FOC missed, but worth monitoring for inexpensive copies.

## Outcome definitions
- **WIN:** Meets the project's defined return threshold with credible completed-sale evidence.
- **NEUTRAL:** Does not materially outperform acquisition cost.
- **LOSS:** Materially underperforms or thesis fails.

Initial practical thresholds may be refined as the ledger grows, but should be stated explicitly when used. Do not retroactively change a prediction standard just to make a prediction look successful.

## Historical lessons
### Minotaur #1
Earlier recommendation was too confident. It demonstrated that creator strength, new IP, and an attractive premise are insufficient without evidence that demand will exceed supply. Treat this as a methodology warning: reduce creator-hype weighting and increase supply/demand evidence.

### Black Star #1
Initially rated too highly; later downgraded after additional investigation. Standard copies remained near cover price. Useful lesson: a later evidence-based downgrade is preferable to defending an earlier thesis.

## Current known watchlist
- The Forever Home #1 — Post-FOC Opportunity / Watch
- Midnight X-Men #1 — Watch
- Midnight Spider-Man #1 — Watch
- Midnight Fantastic Four #1 — Watch

This list is not exhaustive. Update it when new reports identify candidates.

## Current/pending prediction examples
- Crowbound #1 — Pending
- Tales of Wonder #1 — Pending
- Teen Titans #1 — Pending
- Legion of Super-Heroes #1 — Pending
- A Ghost Arm Made of Angry Ghosts #1 — Pending
- Archie #1 — Pending

The structured files under `data/` are authoritative for current status. This document explains methodology and context.

## Weekly operating procedure
1. Determine today's date.
2. Determine the next relevant FOC cutoff in the user's market/time zone.
3. Verify the cutoff date before evaluating books.
4. Identify candidate books whose FOC is still open.
5. Eliminate books whose FOC has passed.
6. Research creative team, publisher, premise, first appearances, variants, incentives, release date, and any other investment-relevant facts.
7. Research current demand signals and market evidence.
8. Search for actual completed-sale evidence where possible; distinguish it from asking prices.
9. Compare candidates with historical recommendations and outcomes.
10. Produce BUY / WATCH / PASS / POST-FOC recommendations with evidence grades and suggested quantities.
11. Save the report and prediction records to the repository.
12. After books release, revisit predictions and record outcomes and postmortems.

## Free workflow
The project intentionally works without paid OpenAI API infrastructure. GitHub Pages hosts the interface. The weekly research can be performed in ChatGPT or another AI with web access, then committed to the repository. Never put an OpenAI API key, GitHub personal access token, or other secret in client-side GitHub Pages code.

## New-chat continuity
If a new AI/chat is needed because a conversation is too long, start with the repository and this document. The exact continuity prompt is documented in `README.md`.
