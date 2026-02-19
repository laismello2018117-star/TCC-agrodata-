// Lista de arquivos para cache (Funcionamento Offline)
const assets = [
  "/agrodata/",
  "/agrodata/index.html",
  "/agrodata/broca.html",
  "/agrodata/ferrugem.html",
  "/agrodata/mancha-aureolada.html",
  "/agrodata/bicho-mineiro.html",
  "/agrodata/cochonilhas.html",
  "/agrodata/acaros.html",
  "/agrodata/cigarra.html",
  "/agrodata/acaro-leprose.html",
  "/agrodata/lagarta.html",
  "/agrodata/css/style.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
];

// Instala o Service Worker e armazena os arquivos no cache
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching assets...");
      return cache.addAll(assets);
    })
  );
});

// Ativa o Service Worker e remove caches antigos se houver
self.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estratégia de busca: Tenta o Cache primeiro, se não tiver, vai à rede
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
