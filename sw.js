var cacheName = 'news-cache';

var filesToCache = [
    './',
    './styles.css',
    './front.js',
    './app.js',
    './fallback.json',
    './images/fetch-dog.jpg'
];









// Install Service Worker
self.addEventListener('install', function(event) {
    
        console.log('Service Worker: Installing....');
    
        event.waitUntil(
    
            // Open the Cache
            caches.open(cacheName).then(function(cache) {
                console.log('Service Worker: Caching App Shell at the moment......');
    
                // Add Files to the Cache
                return cache.addAll(filesToCache);
            })
        );
    });
    
    
    // Fired when the Service Worker starts up
    self.addEventListener('activate', function(event) {
    
        console.log('Service Worker: Activating....');
    
        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(cacheNames.map(function(key) {
                    if( key !== cacheName) {
                        console.log('Service Worker: Removing Old Cache', key);
                        return caches.delete(key);
                    }
                }));
            })
        );
        return self.clients.claim();
    });
    
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
  if(url.origin == location.origin)
  {
      event.respondWith(cacheFirst(req));
  }else{
  
  event.respondWith(networkFirst(req));
  
  }
  
  });
   
  async function cacheFirst(req) {
      const cachedResponse = await caches.match(req);
      return cachedResponse || fetch(req); 
  }
  
  
  async function networkFirst(req){
  
      const cache = await caches.open('news-cache');
  
      try{
  
          const res = await fetch(req);
          cache.put(req, res.clone());
          return res;
      }catch(error){
  
         const cachedResponse =  await cache.match(req);
         return cachedResponse || await caches.match('./fallback.json');
  
      }
  
  }
    
    // triggered everytime, when a push notification is received.
    self.addEventListener('push', function(event) {
    
      console.info('Event: Push');
    
      var title = 'Quick News';
    
      var body = {
        'body': 'Click to see the latest News',
        'tag': 'news',
        'icon': './images/icons/icon-96x96.png'
      };
    
      event.waitUntil(
        self.registration.showNotification(title, body)
      );
    });
    
    
    self.addEventListener('notificationclick', function(event) {
    
      var url = './index.html';
    
      event.notification.close(); //Close the notification
    
      // Open the app and navigate to latest.html after clicking the notification
      event.waitUntil(
        clients.openWindow(url)
      );
    
    });
    




    


// self.addEventListener('install', async event => {
//     const cache = await caches.open('news-static');
//     cache.addAll(staticAssets);
// });









