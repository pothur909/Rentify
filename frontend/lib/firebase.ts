// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAd9edNcwRjnre4hnVYqMWDwVkkNzmAN0w",
    authDomain: "rentify-8c45c.firebaseapp.com",
    projectId: "rentify-8c45c",
    storageBucket: "rentify-8c45c.firebasestorage.app",
    messagingSenderId: "472162507798",
    appId: "1:472162507798:web:735eb48a9c80e618fca937",
    measurementId: "G-GP7282Q9LH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
}

export { app, analytics, messaging, getToken, onMessage };
