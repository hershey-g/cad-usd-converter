# CAD → USD

A live Canadian dollar to US dollar exchange rate converter. Editorial design, PWA-installable, works offline as a home screen app on iOS.

## Features

- Live exchange rate with three API fallbacks (Frankfurter → exchangerate-api → jsDelivr currency-api)
- Manual refresh plus automatic refresh when the app is reopened
- Shows when the app last refreshed and the market data date separately
- iOS numeric keyboard on focus
- Flip direction (CAD ↔ USD)
- Installable as a PWA on iOS and Android home screen
- Service worker keeps the installed PWA available offline and pulls app updates
- No build step — just static HTML, CSS, JS

## Stack

Static site. No dependencies.

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
- `apple-touch-icon.png` — iOS home screen icon (180×180)
- `icon-192.png`, `icon-512.png` — PWA manifest icons
- `favicon-32.png` — browser favicon
