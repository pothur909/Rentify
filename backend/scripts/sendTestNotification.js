/**
 * Script to send a test notification to a specific FCM token
 * Run with: node scripts/sendTestNotification.js <fcmToken>
 */

require('dotenv').config();
const { initializeFirebase, sendPushNotification } = require('../services/notificationService');

async function sendTestNotification() {
  try {
    const token = process.argv[2];
    
    if (!token) {
      console.log('Usage: node scripts/sendTestNotification.js <fcmToken>');
      console.log('\nExample:');
      console.log('node scripts/sendTestNotification.js fT9vI8-w5K33wyV_...');
      process.exit(1);
    }

    console.log('Initializing Firebase...');
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    console.log('Sending test notification...');
    console.log(`Token: ${token.substring(0, 30)}...\n`);

    await sendPushNotification(
      token,
      '🔔 Test Notification',
      'This is a test notification from the reminder system!',
      {
        type: 'test',
        timestamp: new Date().toISOString()
      }
    );

    console.log('\n✅ Test notification sent successfully!');
    console.log('Check your device for the notification.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to send notification:', error.message);
    console.error('\nPossible reasons:');
    console.error('1. Invalid or expired FCM token');
    console.error('2. Firebase credentials not configured correctly');
    console.error('3. App not installed on the device');
    console.error('4. Network connectivity issues');
    process.exit(1);
  }
}

sendTestNotification();
