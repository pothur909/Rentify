/**
 * Migration script to backfill expiry dates for existing PaymentTransactions
 * Run this once to set expiresAt for all existing paid packages
 */

const mongoose = require('mongoose');
const PaymentTransaction = require('../models/PaymentTransaction');
const LeadPackage = require('../models/LeadPackage');

async function backfillPackageExpiry() {
  try {
    console.log('Starting package expiry backfill migration...');

    // Find all paid transactions without expiresAt
    const transactions = await PaymentTransaction.find({
      status: 'paid',
      expiresAt: { $exists: false }
    }).populate('packageId');

    console.log(`Found ${transactions.length} transactions to update`);

    let updated = 0;
    let skipped = 0;

    for (const tx of transactions) {
      try {
        if (!tx.packageId) {
          console.log(`Skipping transaction ${tx._id}: no package found`);
          skipped++;
          continue;
        }

        if (!tx.paidAt) {
          console.log(`Skipping transaction ${tx._id}: no paidAt date`);
          skipped++;
          continue;
        }

        // Parse duration from durationLabel (e.g., "30 days" -> 30)
        let durationDays = 30; // default
        if (tx.packageId.durationLabel) {
          const match = tx.packageId.durationLabel.match(/(\d+)\s*days?/i);
          if (match && match[1]) {
            durationDays = parseInt(match[1], 10);
          }
        }

        // Calculate expiry date
        const expiryDate = new Date(tx.paidAt);
        expiryDate.setDate(expiryDate.getDate() + durationDays);

        // Determine package status
        const now = new Date();
        const leadsAssigned = tx.leadsAssigned || 0;
        const leadsCount = tx.packageId.leadsCount || 0;

        let packageStatus = 'paid';
        if (leadsAssigned >= leadsCount) {
          packageStatus = 'consumed';
        } else if (expiryDate < now) {
          packageStatus = 'expired';
        }

        // Update transaction
        tx.expiresAt = expiryDate;
        tx.packageStatus = packageStatus;
        if (tx.leadsAssigned === undefined) {
          tx.leadsAssigned = 0;
        }

        await tx.save();
        
        console.log(`Updated transaction ${tx._id}: expires ${expiryDate.toISOString()}, status: ${packageStatus}`);
        updated++;
      } catch (err) {
        console.error(`Error updating transaction ${tx._id}:`, err.message);
        skipped++;
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total: ${transactions.length}`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentify';
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return backfillPackageExpiry();
    })
    .then(() => {
      console.log('Migration successful');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration error:', err);
      process.exit(1);
    });
}

module.exports = { backfillPackageExpiry };
