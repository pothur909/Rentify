/**
 * Test script to manually trigger the monthly package renewal process
 * Useful for testing without waiting for the 1st of the month
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { processMonthlyRenewals } = require('../services/packageRenewalScheduler');

async function runManualRenewal() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
    console.log('Starting manual package renewal process...\n');

    await processMonthlyRenewals();

    console.log('\nManual renewal process completed');

  } catch (error) {
    console.error('Error running manual renewal:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
  }
}

// Run manual renewal
runManualRenewal();
