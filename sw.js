var cacheName = 'news-cache';

var filesToCache = [
    './',
    './styles.css',
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












(function() {
    'use strict';
  
    self.addEventListener('notificationclose', function(e) {
      var notification = e.notification;
      var primaryKey = notification.data.primaryKey;
  
      console.log('Closed notification: ' + primaryKey);
    });
  
    self.addEventListener('notificationclick', function(e) {
      var notification = e.notification;
      var primaryKey = notification.data.primaryKey;
      var action = e.action;
  
      if (action === 'close') {
        notification.close();
      } else {
        clients.openWindow('samples/page' + primaryKey + '.html');
        notification.close();
      }
  
      // TODO 5.3 - close all notifications when one is clicked
  
    });
  
    self.addEventListener('push', function(e) {
      var body;
  
      if (e.data) {
        body = e.data.text();
      } else {
        body = 'Default body';
      }
  
      var options = {
        body: body,
        icon: 'images/icons/icon-96x96.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {action: 'explore', title: 'Go to the site',
            icon: 'images/checkmark.png'},
          {action: 'close', title: 'Close the notification',
            icon: 'images/xmark.png'},
        ]
      };
  
      e.waitUntil(
        self.registration.showNotification('Push Notification', options)
      );
    });
  
  })();
  