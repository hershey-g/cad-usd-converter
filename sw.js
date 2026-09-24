/// <reference lib="webworker" />

const CACHE_VERSION = 'cad-usd-converter-2026-09-23-1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
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
      .then((cache) => cache.addAll(APP_SHELL))
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

  if (request.mode === 'navigate') {
    fetchEvent.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  if (url.origin !== self.location.origin || request.method !== 'GET') return;

  fetchEvent.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, response.clone()));
        return response;
      });
      return cached || network;
    })
  );
});
