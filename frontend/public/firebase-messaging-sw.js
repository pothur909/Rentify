// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAd9edNcwRjnre4hnVYqMWDwVkkNzmAN0w",
  authDomain: "rentify-8c45c.firebaseapp.com",
  projectId: "rentify-8c45c",
  storageBucket: "rentify-8c45c.firebasestorage.app",
  messagingSenderId: "472162507798",
  appId: "1:472162507798:web:735eb48a9c80e618fca937",
  measurementId: "G-GP7282Q9LH"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Lead Assigned';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new lead',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
    tag: 'lead-notification',
    requireInteraction: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();
  
  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/dashboard');
      }
    })
  );
});
