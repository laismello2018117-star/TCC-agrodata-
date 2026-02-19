const CACHE_NAME = 'agrodata-v1';

// Usamos caminhos relativos (sem a barra / no início) para funcionar no GitHub Pages
const assets = [
  './',
  './index.html',
  './broca.html',
  './ferrugem.html',
  './mancha-aureolada.html',
  './bicho-mineiro.html',
  './acaro-leprose.html',
  './lagarta.html',
  './css/style.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'
];

// Instalação: Salva os arquivos essenciais no navegador
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Agrodata: Arquivos cacheados com sucesso');
      return cache.addAll(assets);
    })
  );
});

// Ativação: Limpa caches antigos de versões anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estratégia: Tenta carregar da rede, se falhar (offline), busca no cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
