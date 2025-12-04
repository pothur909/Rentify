# Firebase Cloud Messaging Setup Guide

## Overview
This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in the Rentify application. When a new lead is assigned to a broker, they will receive a push notification on their device.

## Prerequisites
- Firebase project (create one at https://console.firebase.google.com)
- Node.js and npm installed
- Access to Firebase Console

## Backend Setup

### 1. Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (rentify-8c45c)
3. Click the gear icon ⚙️ → **Project Settings**
4. Navigate to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded JSON file as `firebase-service-account.json` in the `backend` directory

### 2. Update Backend Environment Variables

Add the following to your `backend/.env` file:

```
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### 3. Secure the Service Account File

Add to `backend/.gitignore`:
```
firebase-service-account.json
```

## Frontend Setup

### 1. Generate VAPID Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ → **Project Settings**
4. Navigate to the **Cloud Messaging** tab
5. Scroll down to **Web Push certificates**
6. Click **Generate key pair**
7. Copy the generated key

### 2. Update Frontend Configuration

Open `frontend/hooks/useNotifications.ts` and replace:
```typescript
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE';
```

With your actual VAPID key:
```typescript
const VAPID_KEY = 'YOUR_ACTUAL_VAPID_KEY';
```

## Testing the Notification System

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected
✅ Firebase Admin SDK initialized successfully
Lead assignment change stream watcher started
```

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

### 3. Test Notification Flow

1. **Login as a Broker**
   - Navigate to `http://localhost:3000/broker-login`
   - Login with your broker credentials
   - You should be prompted to allow notifications
   - Click "Allow" when prompted

2. **Verify Token Registration**
   - Check browser console for: "FCM Token registered with backend successfully"
   - Check backend logs for: "FCM token registered for broker [ID]"

3. **Create a Test Lead**
   - Use the enquiry form or API to create a new lead
   - Make sure the lead's address matches the broker's service area
   - The lead should be automatically assigned to the broker

4. **Verify Notification**
   - You should receive a browser notification with:
     - Title: "🏠 New Lead Assigned!"
     - Body: "New property inquiry in [address]"
   - Check browser console for notification logs
   - Check backend logs for: "✅ Notification sent to broker [name]"

## Troubleshooting

### No Notification Permission Prompt

- Clear browser cache and cookies
- Check if notifications are blocked in browser settings
- Try in an incognito window

### Service Worker Not Registering

- Ensure you're accessing via `localhost` or HTTPS
- Check browser console for service worker errors
- Verify `firebase-messaging-sw.js` is in the `public` folder

### Firebase Initialization Errors

**Backend:**
- Verify `firebase-service-account.json` path is correct
- Check file permissions
- Ensure the JSON file is valid

**Frontend:**
- Verify Firebase config in `lib/firebase.ts` matches your project
- Check VAPID key is correct
- Ensure Firebase SDK version compatibility

### Notifications Not Sending

- Check if broker has FCM tokens in database:
  ```javascript
  db.brokers.findOne({ _id: ObjectId("BROKER_ID") }, { fcmTokens: 1 })
  ```
- Verify lead assignment is working
- Check backend logs for notification errors
- Ensure broker's service area matches lead's address

## Production Deployment

### Important Notes

1. **HTTPS Required**: Service workers and push notifications require HTTPS in production
2. **Environment Variables**: Ensure all Firebase credentials are properly set
3. **CORS**: Update CORS settings if frontend and backend are on different domains
4. **Rate Limiting**: Consider implementing rate limiting for notification endpoints

### Update API URLs

In `frontend/hooks/useNotifications.ts`, update the backend URL:

```typescript
const response = await fetch('https://your-production-api.com/api/notifications/register-token', {
  // ...
});
```

## API Endpoints

### Register FCM Token
```
POST /api/notifications/register-token
Body: { brokerId: string, fcmToken: string }
```

### Remove FCM Token
```
DELETE /api/notifications/remove-token
Body: { brokerId: string, fcmToken: string }
```

## Security Considerations

1. **Never commit** `firebase-service-account.json` to version control
2. **Never expose** VAPID keys in client-side code (they're safe in the frontend as they're public keys)
3. **Validate** broker IDs before registering tokens
4. **Implement** rate limiting on notification endpoints
5. **Clean up** invalid/expired tokens regularly

## Support

For issues or questions:
- Check Firebase Console for quota limits
- Review browser console for client-side errors
- Check backend logs for server-side errors
- Verify MongoDB connection and data integrity
