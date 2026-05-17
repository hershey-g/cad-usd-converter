# CAD → USD

A live Canadian dollar to US dollar exchange rate converter. Editorial design, PWA-installable, works offline as a home screen app on iOS.

## Features

- Live exchange rate with three API fallbacks (Frankfurter → exchangerate-api → jsDelivr currency-api)
- Shows when the rate was last updated (e.g. "3h ago · Nov 12 · 4:00 PM")
- iOS numeric keyboard on focus
- Flip direction (CAD ↔ USD)
- Installable as a PWA on iOS and Android home screen
- Auto-refreshes rate when reopened from background (if data is >30 min stale)
- No build step — just static HTML, CSS, JS

## Stack

Static site. No dependencies.

- Frankfurter API (primary)
- exchangerate-api.com (fallback)
- fawazahmed0 currency-api on jsDelivr (fallback)

## Deploy

Drag the folder into Cloudflare Pages, Netlify, Vercel, or any static host. `index.html` is the entry point.

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
