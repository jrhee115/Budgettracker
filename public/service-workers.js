const { response } = require("express");

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512-512.png",
    "index.js",
    "/indexedDb.js"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("pre-cached successfully");
            cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

//activate
self.addEventListener('activate', function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("removing cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.client.claim();
});

//fetch
self.addEventListener('fetch', function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200){
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                }).catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(err))
        );
        return;
        }
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    )
});