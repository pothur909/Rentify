const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');

exports.createLead = async (req, res, next) => {
  try {
    const { name, phoneNumber, address, budget, flatType } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'name and phoneNumber are required' });
    }

    let areaKey = null;
    let matchedBrokers = [];
    if (address) {
      const addrLower = address.toLowerCase();
      const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } }).lean();
      matchedBrokers = brokers.filter((b) => (b.serviceAreas || []).some((a) => addrLower.includes(String(a).toLowerCase())));
      if (matchedBrokers.length) {
        const areas = matchedBrokers.flatMap((b) => b.serviceAreas || []);
        areaKey = areas.find((a) => addrLower.includes(String(a).toLowerCase())) || null;
      }
    }

    let assignedTo = null;
    let assignedAt = null;
    let status = 'open';

    if (matchedBrokers.length) {
      const ordered = matchedBrokers.sort((a, b) => (a._id.toString() > b._id.toString() ? 1 : -1));
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
      assignedTo = ordered[nextIndex]._id;
      assignedAt = new Date();
      status = 'assigned';
    }

    const lead = await Lead.create({ name, phoneNumber, address, budget, flatType, status, areaKey, assignedTo, assignedAt });
    return res.status(201).json({ message: 'Lead created', data: lead });
  } catch (err) {
    next(err);
  }
};
