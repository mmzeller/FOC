# FOC Heat

Mobile-first comic-book investment research dashboard for the FOC Heat project.

## Live app

- **GitHub repository:** https://github.com/mmzeller/foc
- **GitHub Pages:** https://mmzeller.github.io/foc/

Enable **Settings → Pages → Deploy from a branch → `main` / `/ (root)`** if Pages is not already enabled.

## Current architecture — $0 version

The app is intentionally designed to work without a paid API or Cloudflare account.

- GitHub Pages hosts the mobile/PWA front end.
- `data/current.json` stores the current report.
- `data/watchlist.json` stores the persistent watchlist.
- `research-prompt.md` contains the exact reusable research protocol.
- The **Refresh** button copies the research request and opens ChatGPT so the live web research can be performed without an API bill.
- After a report is completed, the resulting structured data can be committed back to `data/current.json` and the history remains in Git.

This is deliberate. A free application is preferable to a half-working paid backend while funds are limited.

## V1/V2 features

- Mobile-first FOC Heat dashboard
- BUY / WATCH / PASS recommendations
- Investment score, confidence, risk and suggested quantity
- Exact FOC and release dates
- Verified facts / market evidence / investment thesis / unknowns separation
- Persistent watchlist
- Prediction ledger
- PWA manifest for phone home-screen use
- Reusable research prompt
- No OpenAI key stored in the public repository

## Weekly workflow

1. Open **https://mmzeller.github.io/foc/** on the phone.
2. Press **Refresh / Research**.
3. The app copies the project's research prompt and opens ChatGPT.
4. In the existing FOC Heat ChatGPT conversation, run the weekly report so the conversational history remains available.
5. Verify the exact FOC cutoff before ordering.
6. Use the resulting report to update `data/current.json` when desired.
7. Keep every report/prediction in Git history so wins and losses can be audited later.

## Research rules

The project is investment-first:

- FOC dates are a hard constraint.
- Verified facts, market evidence, and investment thesis are separate.
- Unknown print runs, pull counts, retailer order totals, and market prices are never fabricated.
- A #1, famous character, incentive ratio, or creator name does not automatically make a book a buy.
- Acquisition price matters.
- Prior predictions remain in the ledger and are evaluated against actual outcomes.
- Post-FOC books are tracked separately rather than presented as current FOC buys.

## Future paid backend

When funds allow, the project can add a secure serverless backend and OpenAI API integration. The public GitHub Pages site should never contain an OpenAI API key. The existing `backend/` directory is retained as a future implementation path, but it is **not required for the current free workflow**.
