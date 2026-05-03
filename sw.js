const CACHE_NAME = 'mont-blanc-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './layout.css',
  './data.js',
  './app.jsx',
  './header.jsx',
  './icons.jsx',
  './mountain.jsx',
  './workout-card.jsx',
  './week-view.jsx',
  './share-image.jsx',
  './side-panel.jsx',
  './plan-editor.jsx',
  './tweaks.jsx',
  './tweaks-panel.jsx',
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
