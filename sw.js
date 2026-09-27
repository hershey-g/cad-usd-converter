/// <reference lib="webworker" />

// Bump on every release: a changed sw.js is what tells installed apps to update.
const CACHE_VERSION = 'live-exchange-2026-09-27-2';
// Cloudflare Pages 308-redirects /index.html to /, so the shell is cached as './' only.
const SHELL_URL = './';
const APP_SHELL = [
  SHELL_URL,
  './manifest.json',
  './fonts/fraunces-latin.woff2',
  './fonts/inter-latin.woff2',
  './apple-touch-icon.png',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png'
];

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

// Browsers refuse to use a redirected response for a page load ("Response served
// by service worker has redirections"), so store a copy without the redirect flag.
function withoutRedirect(response) {
  if (!response.redirected) return Promise.resolve(response);
  return response.blob().then((body) => new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  }));
}

sw.addEventListener('install', (event) => {
  const installEvent = /** @type {ExtendableEvent} */ (event);
  installEvent.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => Promise.all(APP_SHELL.map((url) =>
        // 'reload' skips the HTTP cache so a new version never precaches stale files.
        fetch(new Request(url, { cache: 'reload' })).then((response) => {
          if (!response.ok) throw new Error(`Precache failed for ${url}: ${response.status}`);
          return withoutRedirect(response).then((clean) => cache.put(url, clean));
        })
      )))
      .then(() => sw.skipWaiting())
  );
});

sw.addEventListener('activate', (event) => {
  const activateEvent = /** @type {ExtendableEvent} */ (event);
  activateEvent.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => sw.clients.claim())
  );
});

sw.addEventListener('message', (event) => {
  const messageEvent = /** @type {ExtendableMessageEvent} */ (event);
  if (messageEvent.data && messageEvent.data.type === 'SKIP_WAITING') {
    sw.skipWaiting();
  }
});

sw.addEventListener('fetch', (event) => {
  const fetchEvent = /** @type {FetchEvent} */ (event);
  const request = fetchEvent.request;
  const url = new URL(request.url);

  // Open instantly from the cached shell. Updates arrive through a new sw.js,
  // which precaches the new shell and reloads the page once it takes over.
  if (request.mode === 'navigate') {
    fetchEvent.respondWith(
      caches.match(SHELL_URL).then((cached) => cached || fetch(request))
    );
    return;
  }

  if (url.origin !== sw.location.origin || request.method !== 'GET') return;

  fetchEvent.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => cached || fetch(request))
  );
});
