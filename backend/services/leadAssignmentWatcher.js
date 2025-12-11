const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');
const { sendLeadAssignmentNotification } = require('./notificationService');
const { getActivePackagesForBroker, findAvailablePackage, assignLeadToPackage } = require('../utils/packageExpiryHelper');

async function assignLeadIfPossible(leadDoc) {
  if (!leadDoc) return;
  if (leadDoc.status !== 'open' || leadDoc.assignedTo) return;

  // Prefer areaKey for matching, fallback to address
  const areaKey = leadDoc.areaKey || '';
  const address = leadDoc.address || '';
  const searchTerm = (areaKey || address).toLowerCase();

  // Get brokers with service areas
  const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } }).lean();
  
  // Filter brokers by service area match
  const matchedBrokers = brokers.filter((b) => 
    (b.serviceAreas || []).some((a) => {
      const serviceArea = String(a).toLowerCase();
      // If lead has areaKey, do exact match; otherwise check if address includes service area
      if (areaKey) {
        return serviceArea === areaKey.toLowerCase();
      }
      return searchTerm.includes(serviceArea) || serviceArea.includes(searchTerm);
    })
  );

  if (!matchedBrokers.length) return; // no match, leave open

  // Filter brokers who have active packages with remaining leads
  const eligibleBrokers = [];
  for (const broker of matchedBrokers) {
    const activePackages = await getActivePackagesForBroker(broker._id);
    const availablePackage = findAvailablePackage(activePackages);
    
    if (availablePackage) {
      eligibleBrokers.push({
        ...broker,
        availablePackage // Store the package for later use
      });
    }
  }

  if (!eligibleBrokers.length) return; // no eligible brokers with package capacity

  const areas = eligibleBrokers.flatMap((b) => b.serviceAreas || []);
  const resolvedAreaKey = areaKey || areas.find((a) => searchTerm.includes(String(a).toLowerCase())) || null;

  const ordered = eligibleBrokers.sort((a, b) => (a._id.toString() > b._id.toString() ? 1 : -1));
  let nextIndex = 0;
  if (resolvedAreaKey) {
    const cursor = await AssignmentCursor.findOne({ areaKey: resolvedAreaKey });
    if (cursor) {
      const lastId = cursor.lastAssignedBroker ? cursor.lastAssignedBroker.toString() : null;
      const idx = ordered.findIndex((b) => b._id.toString() === lastId);
      nextIndex = idx >= 0 ? (idx + 1) % ordered.length : 0;
      cursor.lastAssignedBroker = ordered[nextIndex]._id;
      await cursor.save();
    } else {
      await AssignmentCursor.create({ areaKey: resolvedAreaKey, lastAssignedBroker: ordered[0]._id });
      nextIndex = 0;
    }
  }

  const selectedBroker = ordered[nextIndex];
  const assignedTo = selectedBroker._id;
  const assignedAt = new Date();

  // idempotent update: only assign if still open and unassigned
  const updatedLead = await Lead.findOneAndUpdate(
    { _id: leadDoc._id, status: 'open', $or: [ { assignedTo: null }, { assignedTo: { $exists: false } } ] },
    { $set: { status: 'assigned', assignedTo, assignedAt, areaKey: resolvedAreaKey } },
    { new: true }
  );

  // If lead was successfully assigned, increment package's leadsAssigned counter
  if (updatedLead) {
    // Increment the package counter and update status
    await assignLeadToPackage(selectedBroker.availablePackage._id, updatedLead._id);
    
    // Increment broker's leadsAssigned counter (for backward compatibility)
    await Broker.findByIdAndUpdate(assignedTo, { $inc: { leadsAssigned: 1 } });
    
    // Send push notification to the broker
    await sendLeadAssignmentNotification(assignedTo, updatedLead);
  }
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

module.exports = { startLeadAssignmentWatcher, assignLeadIfPossible };
