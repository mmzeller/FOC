# FOC Heat V2 API

This is the secure server-side component for the GitHub Pages FOC Heat app.

## What it does

- Keeps the OpenAI API key off GitHub Pages and out of browser JavaScript.
- Uses the OpenAI Responses API for research.
- Enables web research through the configured OpenAI web-search tool.
- Stores the latest report, up to 52 historical reports, and the watchlist in Cloudflare KV.
- Sends prior reports and the prediction ledger to the research prompt so the model can learn from previous calls without rewriting history.

## Deploy

1. Install Cloudflare Wrangler.
2. Copy `wrangler.toml.example` to `wrangler.toml`.
3. Create a Cloudflare KV namespace and add its ID to `wrangler.toml` under the `FOC_DATA` binding.
4. Set the OpenAI model as a Worker secret/variable. Do not commit an API key.
5. Set `OPENAI_SEARCH_TOOL` to the web-search tool supported by the OpenAI API account. The example defaults to `web_search_preview`.
6. Deploy the worker.
7. Copy the Worker URL into a local `api-config.js` based on `api-config.js.example`.
8. Add `api-config.js` to the Pages deployment, but never add an OpenAI API key to it.

## Endpoints

- `GET /api/health`
- `GET /api/report`
- `GET /api/history`
- `GET /api/watchlist`
- `POST /api/refresh`

## Important

The backend intentionally does not expose the OpenAI API key. GitHub Pages is a public client, so the key must remain in the Worker environment.
