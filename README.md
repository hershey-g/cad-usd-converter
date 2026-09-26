# Live Exchange

A live exchange rate converter between US dollars (USD), Canadian dollars (CAD), UAE dirhams (AED) and Israeli shekels (ILS). Editorial design, PWA-installable, works offline as a home screen app on iOS.

## Features

- Pick the currency you send and the one you receive with one tap each (defaults to USD → CAD)
- Remembers your amount and currency choice between visits
- Live exchange rate with three API fallbacks (Frankfurter → exchangerate-api → jsDelivr currency-api). Frankfurter has no AED, so AED comes from the fallbacks
- Manual refresh plus automatic refresh when the app is reopened
- Shows when the app last refreshed and the market data date separately
- iOS numeric keyboard on focus
- Installable as a PWA on iOS and Android home screen
- Opens instantly from the service worker cache, works offline, and updates itself in the background (the page reloads once when a new release is ready)
- No build step — just static HTML, CSS, JS

## Stack

Static site. No dependencies. Fraunces and Inter are self-hosted in `fonts/` (SIL Open Font License).

- Frankfurter API (primary)
- exchangerate-api.com (fallback)
- fawazahmed0 currency-api on jsDelivr (fallback)

## Deploy

Use Cloudflare Pages with GitHub auto-deploys:

- Framework preset: None
- Build command: leave blank
- Build output directory: `/`
- Root directory: `/`
- Production branch: `main`

`index.html` is the entry point. There is no build step.

## Install on iPhone

1. Open the site in Safari
2. Tap Share
3. Add to Home Screen

Launches fullscreen with the custom icon.

## Files

- `index.html` — the app
- `manifest.json` — PWA manifest
- `sw.js` — service worker. Bump `CACHE_VERSION` on every release; that is what makes installed apps update
- `_headers` — Cloudflare Pages cache headers (app shell always revalidates, fonts cached for a year)
- `fonts/` — self-hosted Latin subsets of Fraunces and Inter
- `apple-touch-icon.png` — iOS home screen icon (180×180)
- `icon-192.png`, `icon-512.png` — PWA manifest icons
- `favicon-32.png` — browser favicon
