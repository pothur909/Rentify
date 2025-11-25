const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');

// exports.createLead = async (req, res, next) => {
//   try {
//     const { name, phoneNumber, address, budget, flatType, remark } = req.body;

//     if (!name || !phoneNumber) {
//       return res.status(400).json({ message: 'name and phoneNumber are required' });
//     }

//     let areaKey = null;
//     let matchedBrokers = [];
//     if (address) {
//       const addrLower = address.toLowerCase();
//       // Populate currentPackage to check lead limits
//       const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } })
//         .populate('currentPackage')
//         .lean();
//       matchedBrokers = brokers.filter((b) => (b.serviceAreas || []).some((a) => addrLower.includes(String(a).toLowerCase())));
      
//       // Filter brokers who have active packages with remaining leads
//       matchedBrokers = matchedBrokers.filter((b) => {
//         // Must have a current package
//         if (!b.currentPackage) return false;
        
//         // Must have remaining leads (leadsAssigned < leadLimit)
//         const leadsAssigned = b.leadsAssigned || 0;
//         const leadLimit = b.currentPackage.leadLimit || 0;
        
//         return leadsAssigned < leadLimit;
//       });
      
//       if (matchedBrokers.length) {
//         const areas = matchedBrokers.flatMap((b) => b.serviceAreas || []);
//         areaKey = areas.find((a) => addrLower.includes(String(a).toLowerCase())) || null;
//       }
//     }

//     let assignedTo = null;
//     let assignedAt = null;
//     let status = 'open';

//     if (matchedBrokers.length) {
//       const ordered = matchedBrokers.sort((a, b) => (a._id.toString() > b._id.toString() ? 1 : -1));
//       let nextIndex = 0;
//       if (areaKey) {
//         const cursor = await AssignmentCursor.findOne({ areaKey });
//         if (cursor) {
//           const lastId = cursor.lastAssignedBroker ? cursor.lastAssignedBroker.toString() : null;
//           const idx = ordered.findIndex((b) => b._id.toString() === lastId);
//           nextIndex = idx >= 0 ? (idx + 1) % ordered.length : 0;
//           cursor.lastAssignedBroker = ordered[nextIndex]._id;
//           await cursor.save();
//         } else {
//           await AssignmentCursor.create({ areaKey, lastAssignedBroker: ordered[0]._id });
//           nextIndex = 0;
//         }
//       }
//       assignedTo = ordered[nextIndex]._id;
//       assignedAt = new Date();
//       status = 'assigned';
//     }

//     const lead = await Lead.create({ name, phoneNumber, address, budget, flatType, status, areaKey, assignedTo, assignedAt, remark });
    
//     // Increment broker's leadsAssigned counter if lead was assigned
//     if (assignedTo) {
//       await Broker.findByIdAndUpdate(assignedTo, { $inc: { leadsAssigned: 1 } });
//     }
    
//     return res.status(201).json({ message: 'Lead created', data: lead });
//   } catch (err) {
//     next(err);
//   }
// };

exports.createLead = async (req, res, next) => {
  try {
    const { name, phoneNumber, address, budget, flatType, remark, areaKey } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'name and phoneNumber are required' });
    }

    let resolvedAreaKey = areaKey || null;
    let matchedBrokers = [];

    if (resolvedAreaKey) {
      const areaLower = resolvedAreaKey.toLowerCase();

      const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } })
        .populate('currentPackage')
        .lean();

      matchedBrokers = brokers.filter((b) =>
        (b.serviceAreas || []).some((a) => areaLower === String(a).toLowerCase())
      );

      matchedBrokers = matchedBrokers.filter((b) => {
        if (!b.currentPackage) return false;
        const leadsAssigned = b.leadsAssigned || 0;
        const leadLimit = b.currentPackage.leadLimit || 0;
        return leadsAssigned < leadLimit;
      });
    } else if (address) {
      // optional fallback if areaKey not provided
      const addrLower = address.toLowerCase();
      const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } })
        .populate('currentPackage')
        .lean();

      matchedBrokers = brokers.filter((b) =>
        (b.serviceAreas || []).some((a) => addrLower.includes(String(a).toLowerCase()))
      );

      matchedBrokers = matchedBrokers.filter((b) => {
        if (!b.currentPackage) return false;
        const leadsAssigned = b.leadsAssigned || 0;
        const leadLimit = b.currentPackage.leadLimit || 0;
        return leadsAssigned < leadLimit;
      });

      if (matchedBrokers.length) {
        const areas = matchedBrokers.flatMap((b) => b.serviceAreas || []);
        resolvedAreaKey =
          areas.find((a) => addrLower.includes(String(a).toLowerCase())) || null;
      }
    }

    let assignedTo = null;
    let assignedAt = null;
    let status = 'open';

    if (matchedBrokers.length) {
      const ordered = matchedBrokers.sort((a, b) =>
        a._id.toString() > b._id.toString() ? 1 : -1
      );

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

      assignedTo = ordered[nextIndex]._id;
      assignedAt = new Date();
      status = 'assigned';
    }

    const lead = await Lead.create({
      name,
      phoneNumber,
      address,
      budget,
      flatType,
      status,
      areaKey: resolvedAreaKey,
      assignedTo,
      assignedAt,
      remark,
    });

    if (assignedTo) {
      await Broker.findByIdAndUpdate(assignedTo, { $inc: { leadsAssigned: 1 } });
    }

    return res.status(201).json({ message: 'Lead created', data: lead });
  } catch (err) {
    next(err);
  }
};


exports.addRemark = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { remark } = req.body;

    if (!leadId) {
      return res.status(400).json({ message: 'leadId is required' });
    }

    if (!remark) {
      return res.status(400).json({ message: 'remark is required' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.remark = remark;
    await lead.save();

    return res.json({ message: 'Remark added successfully', data: lead });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    if (!leadId) {
      return res.status(400).json({ message: 'leadId is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const allowedStatuses = ['open', 'assigned', 'closed', 'contacted'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.status = status;
    await lead.save();

    return res.json({ message: 'Status updated successfully', data: lead });
  } catch (err) {
    next(err);
  }
};

exports.revealContactDetails = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    if (!leadId) {
      return res.status(400).json({ message: 'leadId is required' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.status = 'contacted';
    await lead.save();

    return res.json({ 
      message: 'Contact details revealed', 
      data: {
        _id: lead._id,
        name: lead.name,
        phoneNumber: lead.phoneNumber,
        status: lead.status
      }
    });
  } catch (err) {
    next(err);
  }
};
