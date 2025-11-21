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
      // Populate currentPackage to check lead limits
      const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } })
        .populate('currentPackage')
        .lean();
      matchedBrokers = brokers.filter((b) => (b.serviceAreas || []).some((a) => addrLower.includes(String(a).toLowerCase())));
      
      // Filter brokers who have active packages with remaining leads
      matchedBrokers = matchedBrokers.filter((b) => {
        // Must have a current package
        if (!b.currentPackage) return false;
        
        // Must have remaining leads (leadsAssigned < leadLimit)
        const leadsAssigned = b.leadsAssigned || 0;
        const leadLimit = b.currentPackage.leadLimit || 0;
        
        return leadsAssigned < leadLimit;
      });
      
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
    
    // Increment broker's leadsAssigned counter if lead was assigned
    if (assignedTo) {
      await Broker.findByIdAndUpdate(assignedTo, { $inc: { leadsAssigned: 1 } });
    }
    
    return res.status(201).json({ message: 'Lead created', data: lead });
  } catch (err) {
    next(err);
  }
};
