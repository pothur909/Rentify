"use client";

import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '@/lib/firebase';
import type { Messaging } from 'firebase/messaging';

const VAPID_KEY = 'BP9kt8g8XqaqBCmemUuYJS_PUkdoQCqTWOhEDudCIzT2azsIU7QbaD9bbO50DtzcWzpB0tDJh_MBWGnw_0MFujM';

interface UseNotificationsProps {
    brokerId: string | null;
    onNotification?: (payload: any) => void;
}

export function useNotifications({ brokerId, onNotification }: UseNotificationsProps) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [error, setError] = useState<string | null>(null);

    // Request notification permission and get FCM token
    const requestPermission = async () => {
        try {
            if (!messaging) {
                console.log('Messaging not supported in this browser');
                return;
            }

            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === 'granted') {
                console.log('Notification permission granted.');

                // Register service worker
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('Service Worker registered:', registration);

                // Get FCM token
                const token = await getToken(messaging as Messaging, {
                    vapidKey: VAPID_KEY,
                    serviceWorkerRegistration: registration,
                });

                if (token) {
                    console.log('FCM Token:', token);
                    setFcmToken(token);

                    // Register token with backend if brokerId is available
                    if (brokerId) {
                        await registerTokenWithBackend(brokerId, token);
                    }
                } else {
                    console.log('No registration token available.');
                }
            } else {
                console.log('Notification permission denied.');
                setError('Notification permission denied');
            }
        } catch (err: any) {
            console.error('Error getting notification permission:', err);
            setError(err.message);
        }
    };

    // Register FCM token with backend
    const registerTokenWithBackend = async (brokerId: string, token: string) => {
        try {
            const response = await fetch('http://localhost:7000/api/notifications/register-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brokerId, fcmToken: token }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('FCM token registered with backend successfully');
            } else {
                console.error('Failed to register FCM token:', data.message);
            }
        } catch (err) {
            console.error('Error registering token with backend:', err);
        }
    };

    // Remove FCM token from backend (on logout)
    const removeToken = async () => {
        if (!fcmToken || !brokerId) return;

        try {
            const response = await fetch('http://localhost:7000/api/notifications/remove-token', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brokerId, fcmToken }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('FCM token removed from backend successfully');
                setFcmToken(null);
            }
        } catch (err) {
            console.error('Error removing token from backend:', err);
        }
    };

    // Handle foreground messages
    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging as Messaging, (payload) => {
            console.log('Foreground message received:', payload);

            // Show notification even when app is in foreground
            if (payload.notification) {
                new Notification(payload.notification.title || 'New Lead', {
                    body: payload.notification.body,
                    icon: '/favicon.ico',
                    data: payload.data,
                });
            }

            // Call custom handler if provided
            if (onNotification) {
                onNotification(payload);
            }
        });

        return () => unsubscribe();
    }, [onNotification]);

    // Auto-request permission when brokerId is available
    useEffect(() => {
        if (brokerId && notificationPermission === 'default') {
            requestPermission();
        }
    }, [brokerId]);

    // Register token with backend when both are available
    useEffect(() => {
        if (brokerId && fcmToken) {
            registerTokenWithBackend(brokerId, fcmToken);
        }
    }, [brokerId, fcmToken]);

    return {
        fcmToken,
        notificationPermission,
        error,
        requestPermission,
        removeToken,
    };
}
