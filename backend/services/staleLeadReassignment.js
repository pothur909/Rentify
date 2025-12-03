const cron = require('node-cron');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');

/**
 * Find eligible brokers for a lead based on area, flat type, and package capacity
 */
async function findEligibleBrokers(lead) {
  const { areaKey, flatType } = lead;

  // Build query for brokers
  const query = {
    serviceAreas: { $exists: true, $ne: [] }
  };

  // Get all brokers with service areas and populate their packages
  const brokers = await Broker.find(query)
    .populate('currentPackage')
    .lean();

  // Filter brokers by matching criteria
  const eligibleBrokers = brokers.filter((broker) => {
    // Must have a current package
    if (!broker.currentPackage) return false;

    // Must have remaining leads capacity
    const leadsAssigned = broker.leadsAssigned || 0;
    const leadsCount = broker.currentPackage.leadsCount || 0;
    if (leadsAssigned >= leadsCount) return false;

    // Must service the same area
    const serviceAreas = broker.serviceAreas || [];
    const areaMatch = areaKey 
      ? serviceAreas.some(area => area.toLowerCase() === areaKey.toLowerCase())
      : false;
    if (!areaMatch) return false;

    // Must support the flat type (if specified)
    if (flatType) {
      const availableFlatTypes = broker.availableFlatTypes || [];
      const flatTypeMatch = availableFlatTypes.some(
        type => type.toLowerCase() === flatType.toLowerCase()
      );
      if (!flatTypeMatch) return false;
    }

    return true;
  });

  return eligibleBrokers;
}

/**
 * Select the next broker using round-robin assignment
 */
async function selectNextBroker(eligibleBrokers, areaKey) {
  if (!eligibleBrokers.length) return null;

  // Sort brokers by ID for consistent ordering
  const ordered = eligibleBrokers.sort((a, b) => 
    a._id.toString() > b._id.toString() ? 1 : -1
  );

  let nextIndex = 0;

  if (areaKey) {
    // Use assignment cursor for round-robin
    const cursor = await AssignmentCursor.findOne({ areaKey });
    if (cursor) {
      const lastId = cursor.lastAssignedBroker ? cursor.lastAssignedBroker.toString() : null;
      const idx = ordered.findIndex((b) => b._id.toString() === lastId);
      nextIndex = idx >= 0 ? (idx + 1) % ordered.length : 0;
      cursor.lastAssignedBroker = ordered[nextIndex]._id;
      await cursor.save();
    } else {
      await AssignmentCursor.create({ areaKey, lastAssignedBroker: ordered[0]._id });
      nextIndex = 0;
    }
  }

  return ordered[nextIndex];
}

/**
 * Check and reassign stale leads (assigned for more than 7 days)
 */
async function checkAndReassignStaleLeads() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find all leads that are still "assigned" and were assigned more than 7 days ago
    const staleLeads = await Lead.find({
      status: 'assigned',
      assignedAt: { $lt: sevenDaysAgo },
      assignedTo: { $exists: true, $ne: null }
    });

    console.log(`[Stale Lead Reassignment] Found ${staleLeads.length} stale leads to process`);

    let reassignedCount = 0;
    let openedCount = 0;

    for (const lead of staleLeads) {
      try {
        const oldBrokerId = lead.assignedTo;

        // Find eligible brokers for this lead
        const eligibleBrokers = await findEligibleBrokers(lead);

        // Filter out the current broker from eligible brokers
        const otherBrokers = eligibleBrokers.filter(
          broker => broker._id.toString() !== oldBrokerId.toString()
        );

        if (otherBrokers.length > 0) {
          // Select next broker using round-robin
          const newBroker = await selectNextBroker(otherBrokers, lead.areaKey);

          if (newBroker) {
            // Update the lead with new broker
            lead.assignedTo = newBroker._id;
            lead.assignedAt = new Date();
            lead.status = 'assigned';
            await lead.save();

            // Update broker counters
            await Broker.findByIdAndUpdate(oldBrokerId, { $inc: { leadsAssigned: -1 } });
            await Broker.findByIdAndUpdate(newBroker._id, { $inc: { leadsAssigned: 1 } });

            reassignedCount++;
            console.log(`[Stale Lead Reassignment] Lead ${lead._id} reassigned from broker ${oldBrokerId} to ${newBroker._id}`);
          } else {
            // No broker selected, set to open
            lead.status = 'open';
            lead.assignedTo = null;
            lead.assignedAt = null;
            await lead.save();

            // Decrement old broker's counter
            await Broker.findByIdAndUpdate(oldBrokerId, { $inc: { leadsAssigned: -1 } });

            openedCount++;
            console.log(`[Stale Lead Reassignment] Lead ${lead._id} set to open (no eligible broker found)`);
          }
        } else {
          // No other eligible brokers, set to open
          lead.status = 'open';
          lead.assignedTo = null;
          lead.assignedAt = null;
          await lead.save();

          // Decrement old broker's counter
          await Broker.findByIdAndUpdate(oldBrokerId, { $inc: { leadsAssigned: -1 } });

          openedCount++;
          console.log(`[Stale Lead Reassignment] Lead ${lead._id} set to open (no other eligible brokers)`);
        }
      } catch (err) {
        console.error(`[Stale Lead Reassignment] Error processing lead ${lead._id}:`, err.message);
      }
    }

    console.log(`[Stale Lead Reassignment] Completed: ${reassignedCount} reassigned, ${openedCount} set to open`);

    return {
      totalProcessed: staleLeads.length,
      reassigned: reassignedCount,
      setToOpen: openedCount
    };
  } catch (err) {
    console.error('[Stale Lead Reassignment] Error:', err.message);
    throw err;
  }
}

/**
 * Start the scheduled job to check for stale leads every hour
 */
function startStaleLeadReassignment() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[Stale Lead Reassignment] Running scheduled check...');
    await checkAndReassignStaleLeads();
  });

  console.log('[Stale Lead Reassignment] Scheduled job started (runs every hour)');
}

module.exports = {
  startStaleLeadReassignment,
  checkAndReassignStaleLeads
};
