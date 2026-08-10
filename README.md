# FOC Heat

Mobile-first comic-book investment research dashboard.

## V1

- Current FOC report dashboard
- BUY / PASS recommendations
- Investment score, confidence, risk and suggested quantity
- Watchlist
- Prediction ledger
- PWA manifest for phone home-screen use

## GitHub Pages

Enable **Settings → Pages → Deploy from a branch → main / root**. The app is static and requires no build step.

## Planned V2

The Refresh button will be connected to a secure serverless backend. The backend will gather current FOC evidence, call the OpenAI API with web research, preserve the project's prediction history, and write the resulting report to persistent storage. Do not put an OpenAI API key in this repository or in browser JavaScript.
