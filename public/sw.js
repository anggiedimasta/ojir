// Service Worker for Ojir PWA

const CACHE_NAME = "ojir-cache-v1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  /** @type {any} */ (event).waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  /** @type {any} */ (event).respondWith(
    caches.match(/** @type {any} */ (event).request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(/** @type {any} */ (event).request);
    }),
  );
});
