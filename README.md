# FOC Heat

Mobile-first comic-book investment research dashboard for the FOC Heat project.

## Live app

- **GitHub repository:** https://github.com/mmzeller/foc
- **GitHub Pages:** https://mmzeller.github.io/foc/

Enable **Settings → Pages → Deploy from a branch → `main` / `/ (root)`** if Pages is not already enabled.

## The project's source of truth

The ChatGPT conversation is **not** the permanent memory of this project. The GitHub repository is.

Read these files first when continuing the project:

1. `PROJECT_CONTEXT.md` — canonical methodology, rules, historical lessons, watchlist context, and weekly procedure.
2. `data/predictions.json` — structured prediction ledger.
3. `data/watchlist.json` — structured watchlist.
4. `data/current.json` — current displayed report.
5. `research-prompt.md` — reusable research protocol.
6. `data/reports/` — archived weekly reports when present.

This structure means a new AI or a new ChatGPT conversation can continue the project without needing the old conversation.

## EXACT PROMPT FOR A NEW AI / NEW CHAT

If this conversation becomes too long, copy and paste the following into the new conversation:

> I am continuing my **FOC Heat comic-book investment research project**. The canonical repository is **https://github.com/mmzeller/foc**. Before doing anything else, inspect the repository and read **PROJECT_CONTEXT.md**, **data/predictions.json**, **data/watchlist.json**, **data/current.json**, and **research-prompt.md**. Treat those files as the project's source of truth rather than relying on memory from another conversation. My objective is **investment profit**, not reading recommendations. I want the highest possible accuracy for FOC cutoff dates and the strongest possible evidence for aftermarket investment potential. Never fabricate print runs, retailer orders, pull-list counts, sales, prices, first appearances, or scarcity. Separate verified facts from market evidence and investment thesis. Never recommend a current FOC buy after its cutoff has passed. Check current web sources and cross-check FOC dates when possible. Preserve and update the historical prediction ledger and explain postmortems for failed predictions. After reading the repository, tell me that you have reconstructed the project state and are ready to continue.

For the weekly report, then say:

> **Run this week's FOC Heat Report.**

If you want the AI to update the repository after producing the report, add:

> **Update the FOC repository with this report, including current.json, the prediction ledger, watchlist changes, and an archived report. Do not overwrite historical predictions; append or update them with an audit-friendly record.**

### If the AI cannot access GitHub directly

Use this fallback:

> I cannot give you connector access to GitHub. Please tell me exactly which files you need me to paste/upload from https://github.com/mmzeller/foc. Do not guess at the project's history.

At minimum provide:
- `PROJECT_CONTEXT.md`
- `data/predictions.json`
- `data/watchlist.json`
- `data/current.json`
- `research-prompt.md`

## Current architecture — $0 version

The app is intentionally designed to work without a paid API or Cloudflare account.

- GitHub Pages hosts the mobile/PWA front end.
- `data/current.json` stores the current report.
- `data/watchlist.json` stores the persistent watchlist.
- `data/predictions.json` stores the prediction ledger.
- `PROJECT_CONTEXT.md` stores the canonical project methodology and continuity information.
- `research-prompt.md` contains the reusable research protocol.
- The **Refresh / Research** workflow prepares the research request and opens ChatGPT so live web research can be performed without an API bill.
- After a report is completed, the structured data can be committed back to the repository and preserved in Git history.

This is deliberate. A free application is preferable to a half-working paid backend while funds are limited.

## Weekly workflow

1. Open **https://mmzeller.github.io/foc/** on the phone.
2. Press **Refresh / Research**.
3. The app prepares the current FOC research request.
4. In ChatGPT or another AI with current web access, use the exact prompt above and run the report.
5. Verify the exact FOC cutoff before ordering.
6. Update `data/current.json`, `data/predictions.json`, and `data/watchlist.json` as appropriate.
7. Archive the report under `data/reports/YYYY-MM-DD.json`.
8. Keep historical predictions intact so wins and losses can be audited later.

## Research rules

The project is investment-first:

- FOC dates are a hard constraint.
- Verified facts, market evidence, and investment thesis are separate.
- Unknown print runs, pull counts, retailer order totals, and market prices are never fabricated.
- A #1, famous character, incentive ratio, or creator name does not automatically make a book a buy.
- Acquisition price matters.
- Prior predictions remain in the ledger and are evaluated against actual outcomes.
- Post-FOC books are tracked separately rather than presented as current FOC buys.
- Do not use false numerical precision when the evidence cannot support it.
- Prefer fewer high-conviction recommendations to a large list of weak speculative picks.

## Prediction ledger

Every recommendation should eventually receive an outcome:

- **WIN** — meets the explicitly stated return threshold with credible completed-sale evidence.
- **NEUTRAL** — does not materially outperform acquisition cost.
- **LOSS** — materially underperforms or the investment thesis fails.

Do not retroactively change the evaluation standard simply to make a prediction appear successful.

## Historical lessons

The project has already learned from misses. **Minotaur #1** demonstrated that creator strength, new IP, and a compelling premise do not establish a profitable investment without evidence that demand will exceed supply. **Black Star #1** demonstrated the value of downgrading a thesis when later evidence weakens it. See `PROJECT_CONTEXT.md` for the full methodology.

## Future paid backend

When funds allow, the project can add a secure serverless backend and OpenAI API integration. The public GitHub Pages site should never contain an OpenAI API key or GitHub personal access token. The existing `backend/` directory is retained as a future implementation path, but it is **not required for the current free workflow**.

## Project philosophy

The goal is not to be right about every comic. The goal is to develop a measurable process that becomes better at identifying **demand/supply imbalances before the FOC deadline**, while maintaining an auditable record of what we believed, why we believed it, what we paid, and what actually happened afterward.
