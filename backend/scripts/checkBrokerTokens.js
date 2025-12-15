/**
 * Script to check broker's FCM tokens
 * Run with: node scripts/checkBrokerTokens.js <brokerId>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Broker = require('../models/Broker');

async function checkBrokerTokens() {
  try {
    const brokerId = process.argv[2];
    
    if (!brokerId) {
      console.log('Usage: node scripts/checkBrokerTokens.js <brokerId>');
      console.log('Or run without arguments to list all brokers with tokens');
      console.log('');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    if (brokerId) {
      // Check specific broker
      const broker = await Broker.findById(brokerId);
      
      if (!broker) {
        console.log(`❌ Broker not found: ${brokerId}`);
        process.exit(1);
      }

      console.log(`📱 Broker: ${broker.name}`);
      console.log(`   ID: ${broker._id}`);
      console.log(`   Phone: ${broker.phoneNumber}`);
      console.log(`   FCM Tokens: ${broker.fcmTokens?.length || 0}`);
      
      if (broker.fcmTokens && broker.fcmTokens.length > 0) {
        console.log('\n   Registered Tokens:');
        broker.fcmTokens.forEach((token, index) => {
          console.log(`   ${index + 1}. ${token.substring(0, 30)}...`);
        });
      } else {
        console.log('\n   ⚠️  No FCM tokens registered!');
        console.log('   The broker needs to log in to the app to register a token.');
      }
    } else {
      // List all brokers with token counts
      const brokers = await Broker.find({}).select('name phoneNumber fcmTokens');
      
      console.log(`📋 Found ${brokers.length} broker(s):\n`);
      
      brokers.forEach((broker, index) => {
        const tokenCount = broker.fcmTokens?.length || 0;
        const status = tokenCount > 0 ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${broker.name}`);
        console.log(`   ID: ${broker._id}`);
        console.log(`   Phone: ${broker.phoneNumber}`);
        console.log(`   Tokens: ${tokenCount}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBrokerTokens();
