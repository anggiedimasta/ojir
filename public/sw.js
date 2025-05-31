// Service Worker for Ojir PWA

const CACHE_NAME = 'ojir-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  /** @type {any} */ (event).waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(urlsToCache); })
  );
});

self.addEventListener('fetch', function(event) {
  /** @type {any} */ (event).respondWith(
    caches.match((/** @type {any} */ (event)).request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch((/** @type {any} */ (event)).request);
      })
  );
});