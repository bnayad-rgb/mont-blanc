const CACHE_NAME = 'mont-blanc-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './layout.css',
  './data.js',
  './app.js',
  './header.js',
  './icons.js',
  './mountain.js',
  './workout-card.js',
  './week-view.js',
  './share-image.js',
  './side-panel.js',
  './plan-editor.js',
  './tweaks.js',
  './tweaks-panel.js',
  './favicon.svg',
  './manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network-first for CDN resources, cache-first for local assets
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {
    // CDN resources: network first, cache fallback
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Local assets: cache first, network fallback
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
