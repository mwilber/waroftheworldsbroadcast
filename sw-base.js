importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

// Static routes
// workbox.routing.registerRoute('https://aframe.io/releases/0.8.2/aframe.min.js', workbox.strategies.staleWhileRevalidate({
//   cacheName: 'ar-frameworks'
// }));

workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workbox.strategies.staleWhileRevalidate({
    cacheName: 'material-frameworks',
    cacheExpiration: {
      maxEntries: 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
}));


// Workbox generated caches here
workbox.precaching.precacheAndRoute([]);