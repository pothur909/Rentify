const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');
const { sendLeadAssignmentNotification } = require('./notificationService');

async function assignLeadIfPossible(leadDoc) {
  if (!leadDoc) return;
  if (leadDoc.status !== 'open' || leadDoc.assignedTo) return;

  const address = leadDoc.address || '';
  const addrLower = address.toLowerCase();

  // Get brokers with service areas and populate their packages
  const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } })
    .populate('currentPackage')
    .lean();
  
  // Filter brokers by service area match
  const matchedBrokers = brokers.filter((b) => (b.serviceAreas || []).some((a) => addrLower.includes(String(a).toLowerCase())));

  if (!matchedBrokers.length) return; // no match, leave open

  // Filter brokers who have active packages with remaining leads
  const eligibleBrokers = matchedBrokers.filter((b) => {
    // Must have a current package
    if (!b.currentPackage) return false;
    
    // Must have remaining leads (leadsAssigned < leadLimit)
    const leadsAssigned = b.leadsAssigned || 0;
    const leadsCount = b.currentPackage.leadsCount || 0;
    
    return leadsAssigned < leadsCount;
  });

  if (!eligibleBrokers.length) return; // no eligible brokers with package capacity

  const areas = eligibleBrokers.flatMap((b) => b.serviceAreas || []);
  const areaKey = areas.find((a) => addrLower.includes(String(a).toLowerCase())) || null;

  const ordered = eligibleBrokers.sort((a, b) => (a._id.toString() > b._id.toString() ? 1 : -1));
  let nextIndex = 0;
  if (areaKey) {
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

  const assignedTo = ordered[nextIndex]._id;
  const assignedAt = new Date();

  // idempotent update: only assign if still open and unassigned
  const updatedLead = await Lead.findOneAndUpdate(
    { _id: leadDoc._id, status: 'open', $or: [ { assignedTo: null }, { assignedTo: { $exists: false } } ] },
    { $set: { status: 'assigned', assignedTo, assignedAt, areaKey } },
    { new: true }
  );

  // If lead was successfully assigned, increment broker's leadsAssigned counter
  if (updatedLead) {
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
