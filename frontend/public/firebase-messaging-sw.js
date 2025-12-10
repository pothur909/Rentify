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
  
  // Use hosted logo from S3 for reliable notifications
  const logoUrl = 'https://edusession-live.s3.ap-south-1.amazonaws.com/logo.jpg';
  
  const notificationTitle = payload.notification?.title || 'Rentify';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: logoUrl,
    badge: logoUrl,
    data: payload.data,
    tag: payload.data?.type || 'rentify-notification',
    requireInteraction: true,
    vibrate: [200, 100, 200]
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
      // Determine target URL based on notification type
      let targetUrl = '/dashboard/leads';
      
      if (event.notification.data?.type === 'lead_reminder') {
        targetUrl = '/dashboard/leads';
      }
      
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
