/// <reference lib="webworker" />

// Bump on every release: a changed sw.js is what tells installed apps to update.
const CACHE_VERSION = 'live-exchange-2026-09-27-1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './fonts/fraunces-latin.woff2',
  './fonts/inter-latin.woff2',
  './apple-touch-icon.png',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png'
];

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

sw.addEventListener('install', (event) => {
  const installEvent = /** @type {ExtendableEvent} */ (event);
  installEvent.waitUntil(
    caches.open(CACHE_VERSION)
      // 'reload' skips the HTTP cache so a new version never precaches stale files.
      .then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))))
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
      caches.match('./index.html').then((cached) => cached || fetch(request))
    );
    return;
  }

  if (url.origin !== sw.location.origin || request.method !== 'GET') return;

  fetchEvent.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => cached || fetch(request))
  );
});
