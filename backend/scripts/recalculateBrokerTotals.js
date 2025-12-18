/**
 * One-time script to recalculate all brokers' leadsAssigned and currentLeadLimit
 * based on their packageHistory entries.
 * 
 * Run with: node scripts/recalculateBrokerTotals.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Broker = require('../models/Broker');

async function recalculateAllBrokerTotals() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all brokers with packageHistory
    const brokers = await Broker.find({
      packageHistory: { $exists: true, $ne: [] }
    });

    console.log(`Found ${brokers.length} brokers with package history`);

    for (const broker of brokers) {
      let totalLeadsLimit = 0;      // Sum of totalLeads from all active packages
      let totalLeadsAssigned = 0;   // Sum of leadsAssigned from all packages

      for (const pkg of broker.packageHistory || []) {
        totalLeadsAssigned += (pkg.leadsAssigned || 0);
        
        if (pkg.status === 'active') {
          totalLeadsLimit += (pkg.totalLeads || 0);
        }
      }

      // Update broker
      await Broker.updateOne(
        { _id: broker._id },
        { 
          $set: { 
            leadsAssigned: totalLeadsAssigned,
            currentLeadLimit: totalLeadsLimit
          } 
        }
      );

      console.log(`Updated ${broker.name}: leadsAssigned=${totalLeadsAssigned}, currentLeadLimit=${totalLeadsLimit}`);
    }

    console.log('\nDone! All brokers updated.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

recalculateAllBrokerTotals();
