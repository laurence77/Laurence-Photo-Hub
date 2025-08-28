/*
  Laurence Photo Hub Service Worker
  - Cache-first for built assets
  - Network-first with fallback for uploads/images
  - App Shell for navigation requests (offline support)
*/
const VERSION = 'v1.0.0';
const APP_SHELL_CACHE = `lph-shell-${VERSION}`;
const RUNTIME_CACHE = `lph-runtime-${VERSION}`;
const APP_SHELL_URLS = [
  '/Laurence-Photo-Hub/',
  '/Laurence-Photo-Hub/index.html',
  '/Laurence-Photo-Hub/offline.html',
  '/Laurence-Photo-Hub/manifest.webmanifest',
  '/Laurence-Photo-Hub/favicon.png',
  '/Laurence-Photo-Hub/placeholder.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

function isAsset(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/Laurence-Photo-Hub/assets/');
}

function isUpload(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/Laurence-Photo-Hub/uploads/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // App shell for navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put('/Laurence-Photo-Hub/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/Laurence-Photo-Hub/index.html').then((cached) => cached || caches.match('/Laurence-Photo-Hub/offline.html')))
    );
    return;
  }

  // Cache-first for built assets
  if (isAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        return res;
      }))
    );
    return;
  }

  // Network-first for uploads/images with placeholder fallback
  if (isUpload(request)) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match('/Laurence-Photo-Hub/placeholder.svg')))
    );
    return;
  }

  // Default: try cache then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      const copy = res.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      return res;
    }).catch(() => caches.match('/Laurence-Photo-Hub/offline.html')))
  );
});

