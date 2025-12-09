const admin = require('firebase-admin');
const Broker = require('../models/Broker');

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase() {
  if (firebaseInitialized) return;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (!serviceAccountPath) {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_PATH not set in .env - Push notifications will be disabled');
      return;
    }

    const serviceAccount = require(`../${serviceAccountPath}`);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    console.warn('⚠️  Push notifications will be disabled');
  }
}

/**
 * Send push notification to a broker when a lead is assigned
 * @param {string} brokerId - The broker's MongoDB ID
 * @param {object} leadData - The lead information
 */
async function sendLeadAssignmentNotification(brokerId, leadData) {
  if (!firebaseInitialized) {
    console.log('Firebase not initialized - skipping notification');
    return;
  }

  try {
    // Get broker's FCM tokens
    const broker = await Broker.findById(brokerId).select('fcmTokens name');
    
    if (!broker || !broker.fcmTokens || broker.fcmTokens.length === 0) {
      console.log(`No FCM tokens found for broker ${brokerId}`);
      return;
    }

    const tokens = broker.fcmTokens;

    // Prepare notification payload
    const message = {
      notification: {
        title: '🏠 New Lead Assigned!',
        body: `New property inquiry in ${leadData.address || 'your service area'}`,
      },
      data: {
        leadId: leadData._id.toString(),
        address: leadData.address || '',
        propertyType: leadData.propertyType || '',
        budget: leadData.budget?.toString() || '',
        timestamp: new Date().toISOString(),
      },
    };

    // Send to all tokens
    const invalidTokens = [];
    const sendPromises = tokens.map(async (token) => {
      try {
        await admin.messaging().send({
          ...message,
          token: token,
        });
        console.log(`✅ Notification sent to broker ${broker.name} (${brokerId})`);
      } catch (error) {
        // Handle invalid or expired tokens
        if (
          error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered'
        ) {
          console.log(`Invalid token detected: ${token.substring(0, 20)}...`);
          invalidTokens.push(token);
        } else {
          console.error('Error sending notification:', error.message);
        }
      }
    });

    await Promise.all(sendPromises);

    // Remove invalid tokens from database
    if (invalidTokens.length > 0) {
      await Broker.findByIdAndUpdate(brokerId, {
        $pull: { fcmTokens: { $in: invalidTokens } },
      });
      console.log(`Removed ${invalidTokens.length} invalid token(s) from broker ${brokerId}`);
    }
  } catch (error) {
    console.error('Error in sendLeadAssignmentNotification:', error.message);
  }
}

/**
 * Register a new FCM token for a broker
 * @param {string} brokerId - The broker's MongoDB ID
 * @param {string} fcmToken - The FCM token to register
 */
async function registerFCMToken(brokerId, fcmToken) {
  try {
    // Add token if it doesn't already exist (using $addToSet)
    await Broker.findByIdAndUpdate(
      brokerId,
      { $addToSet: { fcmTokens: fcmToken } },
      { new: true }
    );
    console.log(`FCM token registered for broker ${brokerId}`);
  } catch (error) {
    console.error('Error registering FCM token:', error.message);
    throw error;
  }
}

/**
 * Remove an FCM token for a broker (e.g., on logout)
 * @param {string} brokerId - The broker's MongoDB ID
 * @param {string} fcmToken - The FCM token to remove
 */
async function removeFCMToken(brokerId, fcmToken) {
  try {
    await Broker.findByIdAndUpdate(
      brokerId,
      { $pull: { fcmTokens: fcmToken } },
      { new: true }
    );
    console.log(`FCM token removed for broker ${brokerId}`);
  } catch (error) {
    console.error('Error removing FCM token:', error.message);
    throw error;
  }
}

module.exports = {
  initializeFirebase,
  sendLeadAssignmentNotification,
  registerFCMToken,
  removeFCMToken,
};
