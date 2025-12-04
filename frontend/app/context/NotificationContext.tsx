"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthContext } from '@/app/context/AuthContext';

interface NotificationContextType {
  fcmToken: string | null;
  notificationPermission: NotificationPermission;
  error: string | null;
  requestPermission: () => Promise<void>;
  removeToken: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { broker } = useAuthContext();
  const brokerId = broker?._id || null;

  const notificationState = useNotifications({
    brokerId,
    onNotification: (payload: any) => {
      console.log('New notification received:', payload);
      // You can add custom logic here, like showing a toast or updating UI
    },
  });

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
