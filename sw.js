/* Aguid@Help — Service Worker (PWA): instalação offline */
const CACHE = "aguidhelp-v6";
const CACHE_STATIC = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/app.css?v=6",
  "./js/database.js?v=6",
  "./js/seed.js?v=6",
  "./js/ui.js?v=6",
  "./js/views-comuns.js?v=6",
  "./js/views-cliente.js?v=6",
  "./js/views-profissional.js?v=6",
  "./js/views-admin.js?v=6",
  "./js/app.js?v=6",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CACHE_STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Nunca intercepta a API de dados (deve alcançar o servidor)
  if (url.pathname.includes("/api/")) return;

  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const rede = fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok && url.origin === location.origin) {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || rede;
    })
  );
});