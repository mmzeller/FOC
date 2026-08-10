# FOC Heat

Mobile-first comic-book investment research dashboard for the FOC Heat project.

## Live app

- GitHub repository: https://github.com/mmzeller/foc
- GitHub Pages: https://mmzeller.github.io/foc/

The Pages site is the phone-friendly front end. Enable **Settings → Pages → Deploy from a branch → main / root** if Pages is not already enabled.

## V1

- Current FOC report dashboard
- BUY / WATCH / PASS recommendations
- Investment score, confidence, risk and suggested quantity
- Watchlist
- Prediction ledger
- PWA manifest for phone home-screen use

## V2 — live research

V2 adds a secure serverless backend under `backend/`.

- `POST /api/refresh` runs fresh FOC research.
- The research engine verifies the next actual FOC window instead of assuming a calendar date.
- OpenAI web research is used from the server side.
- Previous reports, the watchlist, and prediction history are supplied to the research engine for continuity.
- Up to 52 historical reports are stored in Cloudflare KV.
- The browser never receives the OpenAI API key.
- A personal application token protects the backend endpoints.
- The UI falls back to the stored baseline report until the backend is configured.

### V2 setup

1. Deploy `backend/worker.js` to Cloudflare Workers using `backend/wrangler.toml.example` as the starting point.
2. Create a Cloudflare KV namespace and bind it as `FOC_DATA`.
3. Configure Worker secrets/variables: `OPENAI_API_KEY`, `OPENAI_MODEL`, and a strong `APP_TOKEN`. Configure `OPENAI_SEARCH_TOOL` if your account uses a different supported web-search tool name.
4. Put the deployed Worker URL into `api-config.js` as `window.FOC_API_BASE`.
5. Either put the `APP_TOKEN` into `window.FOC_CLIENT_TOKEN` or leave it blank and let the app ask for it once. The latter stores the token only in that browser's local storage.
6. Reload the GitHub Pages app and press **Refresh**.

Do not commit the OpenAI API key. See `backend/README.md` for the complete deployment notes and security limitations.

## Research rules

The application is intentionally investment-first:

- FOC dates are a hard constraint.
- Verified facts, market evidence, and investment thesis are separate.
- Unknown print runs, pull counts, retailer order totals, and market prices are never fabricated.
- A #1, famous character, incentive ratio, or creator name does not automatically make a book a buy.
- Prior predictions remain in the ledger and are evaluated against actual outcomes.
