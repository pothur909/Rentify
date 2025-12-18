const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');
const { sendLeadAssignmentNotification } = require('./notificationService');

/**
 * Recalculate and update broker's top-level totals from packageHistory
 * - leadsAssigned: sum of leadsAssigned from all packages
 * - currentLeadLimit: sum of totalLeads from all ACTIVE packages
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @returns {Promise<{leadsAssigned: number, currentLeadLimit: number}>}
 */
async function recalculateBrokerTotals(brokerId) {
  const broker = await Broker.findById(brokerId);
  if (!broker) return null;
  
  let totalLeadsLimit = 0;      // Sum of totalLeads from all active packages
  let totalLeadsAssigned = 0;   // Sum of leadsAssigned from all packages
  
  for (const pkg of broker.packageHistory || []) {
    totalLeadsAssigned += (pkg.leadsAssigned || 0);
    
    if (pkg.status === 'active') {
      totalLeadsLimit += (pkg.totalLeads || 0);
    }
  }
  
  await Broker.updateOne(
    { _id: brokerId },
    { 
      $set: { 
        leadsAssigned: totalLeadsAssigned,
        currentLeadLimit: totalLeadsLimit
      } 
    }
  );
  
  console.log(`[recalculateBrokerTotals] Broker ${brokerId}: leadsAssigned=${totalLeadsAssigned}, currentLeadLimit=${totalLeadsLimit}`);
  
  return { leadsAssigned: totalLeadsAssigned, currentLeadLimit: totalLeadsLimit };
}

/**
 * Find eligible brokers for a lead based on location and active package capacity
 * @param {string} areaKey - The area key to match
 * @returns {Promise<Array>} - Array of eligible brokers with their available package
 */
async function findEligibleBrokers(areaKey) {
  console.log(`[findEligibleBrokers] Looking for brokers in area: "${areaKey}"`);
  
  // Step 1: Get all brokers with serviceAreas matching the areaKey
  const brokers = await Broker.find({
    serviceAreas: areaKey  // Exact match on areaKey
  }).lean();
  
  console.log(`[findEligibleBrokers] Found ${brokers.length} brokers matching area "${areaKey}"`);
  
  if (!brokers.length) return [];
  
  // Step 2: Filter brokers who have active packages with remaining capacity
  const eligibleBrokers = [];
  
  for (const broker of brokers) {
    console.log(`[findEligibleBrokers] Checking broker ${broker.name} (${broker._id})`);
    
    // Check packageHistory for active packages with capacity
    const activePackage = (broker.packageHistory || []).find(pkg => 
      pkg.status === 'active' && 
      (pkg.leadsAssigned || 0) < (pkg.totalLeads || 0)
    );
    
    if (activePackage) {
      const remaining = (activePackage.totalLeads || 0) - (activePackage.leadsAssigned || 0);
      console.log(`[findEligibleBrokers] ✓ ${broker.name} has active package ${activePackage._id} with ${remaining} leads remaining`);
      eligibleBrokers.push({
        ...broker,
        availablePackage: activePackage
      });
    } else {
      console.log(`[findEligibleBrokers] ✗ ${broker.name} has no active package with capacity`);
    }
  }
  
  console.log(`[findEligibleBrokers] Total eligible brokers: ${eligibleBrokers.length}`);
  return eligibleBrokers;
}

/**
 * Get the next broker in round-robin order for the given area
 * @param {Array} eligibleBrokers - Array of eligible brokers
 * @param {string} areaKey - The area key for round-robin tracking
 * @returns {Promise<Object>} - The next broker to assign
 */
async function getNextBrokerRoundRobin(eligibleBrokers, areaKey) {
  if (!eligibleBrokers.length) return null;
  
  // Sort brokers by _id for consistent ordering
  const sortedBrokers = eligibleBrokers.sort((a, b) => 
    a._id.toString().localeCompare(b._id.toString())
  );
  
  console.log(`[getNextBrokerRoundRobin] Sorted ${sortedBrokers.length} brokers for round-robin`);
  sortedBrokers.forEach((b, i) => console.log(`  [${i}] ${b.name} (${b._id})`));
  
  // Get the cursor for this area
  let cursor = await AssignmentCursor.findOne({ areaKey });
  let nextIndex = 0;
  
  if (cursor && cursor.lastAssignedBroker) {
    const lastBrokerId = cursor.lastAssignedBroker.toString();
    const lastIndex = sortedBrokers.findIndex(b => b._id.toString() === lastBrokerId);
    
    if (lastIndex >= 0) {
      // Move to next broker in the list
      nextIndex = (lastIndex + 1) % sortedBrokers.length;
    }
    console.log(`[getNextBrokerRoundRobin] Last assigned: ${lastBrokerId}, lastIndex: ${lastIndex}, nextIndex: ${nextIndex}`);
  } else {
    console.log(`[getNextBrokerRoundRobin] No cursor found, starting at index 0`);
  }
  
  const selectedBroker = sortedBrokers[nextIndex];
  
  // Update or create the cursor
  if (cursor) {
    cursor.lastAssignedBroker = selectedBroker._id;
    await cursor.save();
  } else {
    await AssignmentCursor.create({ areaKey, lastAssignedBroker: selectedBroker._id });
  }
  
  console.log(`[getNextBrokerRoundRobin] Selected broker: ${selectedBroker.name} (${selectedBroker._id})`);
  return selectedBroker;
}

/**
 * Update broker's packageHistory when a lead is assigned
 * Also recalculates currentLeadLimit (sum of totalLeads from active packages)
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @param {string} packageHistoryId - The _id of the packageHistory entry
 */
async function incrementPackageLeadsAssigned(brokerId, packageHistoryId) {
  console.log(`[incrementPackageLeadsAssigned] Updating broker ${brokerId}, packageHistory ${packageHistoryId}`);
  
  // Step 1: Increment the leadsAssigned in the specific package
  const result = await Broker.updateOne(
    { 
      _id: brokerId,
      'packageHistory._id': packageHistoryId
    },
    {
      $inc: { 
        'packageHistory.$.leadsAssigned': 1
      }
    }
  );
  
  console.log(`[incrementPackageLeadsAssigned] Package update result:`, result.modifiedCount > 0 ? 'success' : 'failed');
  
  // Step 2: Fetch broker and recalculate totals from all packages
  const broker = await Broker.findById(brokerId);
  if (!broker) return;
  
  // Calculate totals from packageHistory
  let totalLeadsLimit = 0;      // Sum of totalLeads from all active packages
  let totalLeadsAssigned = 0;   // Sum of leadsAssigned from all packages
  
  for (const pkg of broker.packageHistory || []) {
    // Add leadsAssigned from all packages (active, consumed, etc.)
    totalLeadsAssigned += (pkg.leadsAssigned || 0);
    
    // Add totalLeads only from active packages
    if (pkg.status === 'active') {
      totalLeadsLimit += (pkg.totalLeads || 0);
    }
  }
  
  console.log(`[incrementPackageLeadsAssigned] Calculated totals: leadsAssigned=${totalLeadsAssigned}, currentLeadLimit=${totalLeadsLimit}`);
  
  // Step 3: Check if the specific package is now consumed
  const pkg = broker.packageHistory.id(packageHistoryId);
  let packageConsumed = false;
  if (pkg && pkg.leadsAssigned >= pkg.totalLeads) {
    packageConsumed = true;
    console.log(`[incrementPackageLeadsAssigned] Package ${packageHistoryId} is now consumed`);
    
    // Recalculate totalLeadsLimit excluding this package (since it's now consumed)
    totalLeadsLimit = 0;
    for (const p of broker.packageHistory || []) {
      if (p.status === 'active' && p._id.toString() !== packageHistoryId.toString()) {
        totalLeadsLimit += (p.totalLeads || 0);
      }
    }
  }
  
  // Step 4: Update broker's top-level fields
  const updateFields = {
    leadsAssigned: totalLeadsAssigned,
    currentLeadLimit: totalLeadsLimit
  };
  
  if (packageConsumed) {
    await Broker.updateOne(
      { _id: brokerId, 'packageHistory._id': packageHistoryId },
      { 
        $set: { 
          ...updateFields,
          'packageHistory.$.status': 'consumed' 
        } 
      }
    );
  } else {
    await Broker.updateOne(
      { _id: brokerId },
      { $set: updateFields }
    );
  }
  
  console.log(`[incrementPackageLeadsAssigned] Updated broker: leadsAssigned=${totalLeadsAssigned}, currentLeadLimit=${totalLeadsLimit}`);
}

/**
 * Main function to assign a lead to an eligible broker
 */
async function assignLeadIfPossible(leadDoc) {
  if (!leadDoc) return;
  if (leadDoc.status !== 'open' || leadDoc.assignedTo) return;

  const areaKey = leadDoc.areaKey || '';
  
  console.log(`\n========================================`);
  console.log(`[assignLeadIfPossible] Processing lead ${leadDoc._id}`);
  console.log(`[assignLeadIfPossible] areaKey: "${areaKey}"`);
  console.log(`========================================`);

  if (!areaKey) {
    console.log(`[assignLeadIfPossible] No areaKey, lead will remain open`);
    return;
  }

  // Step 1: Find all eligible brokers (matching area + active package with capacity)
  const eligibleBrokers = await findEligibleBrokers(areaKey);
  
  if (!eligibleBrokers.length) {
    console.log(`[assignLeadIfPossible] No eligible brokers found, lead will remain open`);
    return;
  }

  // Step 2: Get next broker in round-robin order
  const selectedBroker = await getNextBrokerRoundRobin(eligibleBrokers, areaKey);
  
  if (!selectedBroker) {
    console.log(`[assignLeadIfPossible] No broker selected, lead will remain open`);
    return;
  }

  // Step 3: Assign the lead
  const assignedTo = selectedBroker._id;
  const assignedAt = new Date();
  
  console.log(`[assignLeadIfPossible] Assigning lead to ${selectedBroker.name} (${assignedTo})`);

  // Atomic update: only assign if still open and unassigned
  const updatedLead = await Lead.findOneAndUpdate(
    { 
      _id: leadDoc._id, 
      status: 'open', 
      $or: [{ assignedTo: null }, { assignedTo: { $exists: false } }] 
    },
    { 
      $set: { 
        status: 'assigned', 
        assignedTo, 
        assignedAt, 
        areaKey 
      } 
    },
    { new: true }
  );

  if (updatedLead) {
    console.log(`[assignLeadIfPossible] ✓ Lead assigned successfully!`);
    
    // Step 4: Update broker's package counter
    await incrementPackageLeadsAssigned(assignedTo, selectedBroker.availablePackage._id);
    
    // Step 5: Send push notification
    try {
      await sendLeadAssignmentNotification(assignedTo, updatedLead);
      console.log(`[assignLeadIfPossible] ✓ Notification sent`);
    } catch (err) {
      console.error(`[assignLeadIfPossible] Failed to send notification:`, err.message);
    }
  } else {
    console.log(`[assignLeadIfPossible] Lead was already assigned or status changed`);
  }
  
  console.log(`========================================\n`);
}

function startLeadAssignmentWatcher(conn) {
  try {
    const changeStream = conn.collection('leads').watch([
      { $match: { operationType: 'insert' } }
    ], { fullDocument: 'updateLookup' });

    changeStream.on('change', async (change) => {
      try {
        const leadDoc = change.fullDocument;
        await assignLeadIfPossible(leadDoc);
      } catch (err) {
        console.error('Lead assignment watcher error:', err.message);
      }
    });

    console.log('Lead assignment change stream watcher started');
  } catch (err) {
    console.error('Failed to start lead assignment watcher:', err.message);
  }
}

module.exports = { startLeadAssignmentWatcher, assignLeadIfPossible, recalculateBrokerTotals };
