const CACHE_NAME = '10step-journal-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/logo192.png',
    '/logo512.png',
    '/favicon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 