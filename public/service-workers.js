const FILES_TO_CACHE = [
    "/",
    "/index.html",
    ""
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("pre-cached successfully");
            return cache.addAll(FILES_TO_CACHE);
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
                        if (key !== CACHE_NAME && key !==DATA_CACHE_NAME){
                            console.log("removing cache data", key);
                            return caches.delete(key);
                        }
                    })
                );
            })
        );
        self.client.claim();
    });