/* ADHD Life Planner — service worker
   Cache-first offline support for the app shell + CDN assets (Chart.js, fonts).
   Bump CACHE_VERSION whenever a new app version is deployed so clients update. */
const CACHE_VERSION = 'adhd-planner-v30';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // Icons may not exist in some setups — cache what we can, never fail install
      .then(cache => Promise.allSettled(SHELL.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Cache-first for the shell, CDN scripts, and Google Fonts (CSS + woff2);
  // anything else goes straight to the network.
  const cacheable = url.origin === self.location.origin
    || url.hostname === 'cdn.jsdelivr.net'
    || url.hostname === 'fonts.googleapis.com'
    || url.hostname === 'fonts.gstatic.com';
  if (!cacheable) return;
  // Navigations are NETWORK-FIRST: online users always get the newest deployed
  // version; the cached shell is only the offline fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy));
        }
        return res;
      }).catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: url.origin === self.location.origin }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        // Offline and not cached: navigations fall back to the app shell
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
