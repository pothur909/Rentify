/**
 * Script to send a test notification to a broker by their ID
 * Run with: node scripts/testBrokerNotification.js <brokerId>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Broker = require('../models/Broker');
const { initializeFirebase, sendPushNotification } = require('../services/notificationService');

async function testBrokerNotification() {
  try {
    const brokerId = process.argv[2] || '693801de70ce8f1d37cf70ce'; // Default to broker "zz"
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('Initializing Firebase...');
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    console.log(`Fetching broker ${brokerId}...`);
    const broker = await Broker.findById(brokerId);
    
    if (!broker) {
      console.log(`❌ Broker not found: ${brokerId}`);
      process.exit(1);
    }

    console.log(`📱 Broker: ${broker.name}`);
    console.log(`   Phone: ${broker.phoneNumber}`);
    console.log(`   FCM Tokens: ${broker.fcmTokens?.length || 0}\n`);

    if (!broker.fcmTokens || broker.fcmTokens.length === 0) {
      console.log('❌ No FCM tokens registered for this broker');
      console.log('The broker needs to log in to the app first.');
      process.exit(1);
    }

    console.log('Sending test notification to all devices...\n');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < broker.fcmTokens.length; i++) {
      const token = broker.fcmTokens[i];
      console.log(`Device ${i + 1}/${broker.fcmTokens.length}: ${token.substring(0, 30)}...`);
      
      try {
        await sendPushNotification(
          token,
          '🔔 Test Reminder Notification',
          'This is a test notification from the reminder system! If you see this, notifications are working correctly.',
          {
            type: 'test',
            brokerId: broker._id.toString(),
            brokerName: broker.name,
            timestamp: new Date().toISOString()
          }
        );
        console.log('   ✅ Sent successfully\n');
        successCount++;
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}\n`);
        failCount++;
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Results: ${successCount} sent, ${failCount} failed`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (successCount > 0) {
      console.log('✅ Test notification sent successfully!');
      console.log('📱 Check your device for the notification.');
      console.log('\nIf you received it, the reminder system is working correctly!');
    } else {
      console.log('❌ All notifications failed');
      console.log('\nPossible reasons:');
      console.log('1. Invalid or expired FCM token');
      console.log('2. App not installed on the device');
      console.log('3. Notification permissions not granted');
      console.log('4. Firebase credentials issue');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testBrokerNotification();
