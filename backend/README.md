# FOC Heat V2 API

This is the secure server-side component for the GitHub Pages FOC Heat app.

## What it does

- Keeps the OpenAI API key off GitHub Pages and out of browser JavaScript.
- Uses the OpenAI Responses API for research.
- Enables web research through the configured OpenAI web-search tool.
- Stores the latest report, up to 52 historical reports, and the watchlist in Cloudflare KV.
- Sends prior reports and the prediction ledger to the research prompt so the model can learn from previous calls without rewriting history.
- Protects all data/research endpoints with a personal application token.

## Deploy

1. Install Cloudflare Wrangler.
2. Copy `wrangler.toml.example` to `wrangler.toml`.
3. Create a Cloudflare KV namespace and add its ID to `wrangler.toml` under the `FOC_DATA` binding.
4. Create a strong random `APP_TOKEN`. Store it as a Worker secret/variable. This is the token the private browser app uses; it is not the OpenAI key.
5. Store `OPENAI_API_KEY` as a Worker secret.
6. Set `OPENAI_MODEL` to a model available to your OpenAI API account.
7. Set `OPENAI_SEARCH_TOOL` to the web-search tool supported by the OpenAI API account. The example defaults to `web_search_preview`.
8. Deploy the worker.
9. Copy the Worker URL into `api-config.js` as `window.FOC_API_BASE`.
10. Either put the same `APP_TOKEN` in `window.FOC_CLIENT_TOKEN` locally, or leave it blank and let the app prompt once and store it in that browser's local storage.

Do not put `OPENAI_API_KEY` in `api-config.js`.

## Endpoints

- `GET /api/health`
- `GET /api/report`
- `GET /api/history`
- `GET /api/watchlist`
- `POST /api/refresh`

All endpoints except health require `Authorization: Bearer <APP_TOKEN>`.

## Important security note

The GitHub Pages site is public. The browser token is an access credential, not a secret suitable for protecting a high-value public service. For a personal app it provides a basic gate; if the app is ever exposed beyond personal use, put Cloudflare Access or another real authentication layer in front of the Worker and add rate limiting.
