/**
 * Test script to manually check and send due reminders
 * Run with: node scripts/testReminders.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { checkAndSendReminders } = require('../services/reminderScheduler');
const { initializeFirebase } = require('../services/notificationService');

async function testReminders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('Initializing Firebase...');
    initializeFirebase();

    console.log('\nChecking for due reminders...');
    await checkAndSendReminders();

    console.log('\n✅ Test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testReminders();
