const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const AssignmentCursor = require('../models/AssignmentCursor');

exports.createLead = async (req, res, next) => {
  try {
    const { name, phoneNumber, address, budget, flatType, remark } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'name and phoneNumber are required' });
    }

    let areaKey = null;
    let matchedBrokers = [];
    if (address) {
      const addrLower = address.toLowerCase();
      console.log('🔍 Looking for brokers with address:', addrLower);
      
      // Populate currentPackage to check lead limits
      const brokers = await Broker.find({ serviceAreas: { $exists: true, $ne: [] } })
        .populate('currentPackage')
        .lean();
      console.log('📋 Total brokers with service areas:', brokers.length);
      
      matchedBrokers = brokers.filter((b) => (b.serviceAreas || []).some((a) => addrLower.includes(String(a).toLowerCase())));
      console.log('✅ Brokers matching address:', matchedBrokers.length);
      console.log('📍 Matched brokers:', matchedBrokers.map(b => ({ name: b.name, areas: b.serviceAreas, package: b.currentPackage?._id, leadsAssigned: b.leadsAssigned })));
      
      // Filter brokers who have active packages with remaining leads
      matchedBrokers = matchedBrokers.filter((b) => {
        // Must have a current package
        if (!b.currentPackage) {
          console.log(`❌ Broker ${b.name} has no current package`);
          return false;
        }
        
        // Must have remaining leads (leadsAssigned < leadLimit)
        const leadsAssigned = b.leadsAssigned || 0;
        const leadLimit = b.currentPackage.leadLimit || 0;
        
        console.log(`📊 Broker ${b.name}: ${leadsAssigned}/${leadLimit} leads assigned`);
        
        return leadsAssigned < leadLimit;
      });
      
      console.log('🎯 Final eligible brokers:', matchedBrokers.length);
      
      if (matchedBrokers.length) {
        const areas = matchedBrokers.flatMap((b) => b.serviceAreas || []);
        areaKey = areas.find((a) => addrLower.includes(String(a).toLowerCase())) || null;
        console.log('🗺️ Area key selected:', areaKey);
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

    const lead = await Lead.create({ name, phoneNumber, address, budget, flatType, status, areaKey, assignedTo, assignedAt, remark });
    
    // Increment broker's leadsAssigned counter if lead was assigned
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

exports.getAllLeadsForAdmin = async (req, res, next) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Lead.countDocuments();

    // Fetch paginated leads
    const leads = await Lead.find()
      .populate('assignedTo', 'name email phoneNumber serviceAreas')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return res.json({ 
      message: 'Leads fetched successfully', 
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount: totalCount,
        totalPages: totalPages,
        hasMore: hasMore
      },
      data: leads
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign open leads to a specific broker
 * POST /api/leads/assign-to-broker
 * Body: { brokerId: string, leadIds: string[] } (optional leadIds, if not provided assigns all open leads)
 */
exports.assignOpenLeadsToBroker = async (req, res, next) => {
  try {
    const { brokerId, leadIds } = req.body;

    if (!brokerId) {
      return res.status(400).json({ message: 'brokerId is required' });
    }

    // Verify broker exists
    const broker = await Broker.findById(brokerId).populate('currentPackage');
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    // Check if broker has an active package
    if (!broker.currentPackage) {
      return res.status(400).json({ message: 'Broker does not have an active package' });
    }

    // Build query for leads to assign
    let query = { status: 'open' };
    if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
      query._id = { $in: leadIds };
    }

    // Find leads to assign
    const leadsToAssign = await Lead.find(query);

    if (leadsToAssign.length === 0) {
      return res.status(404).json({ message: 'No open leads found to assign' });
    }

    // Check if broker has enough capacity
    const currentLeadsAssigned = broker.leadsAssigned || 0;
    const leadLimit = broker.currentPackage.leadLimit || 0;
    const availableCapacity = leadLimit - currentLeadsAssigned;

    if (availableCapacity <= 0) {
      return res.status(400).json({ 
        message: 'Broker has reached their lead limit',
        details: {
          currentLeadsAssigned,
          leadLimit,
          availableCapacity: 0
        }
      });
    }

    // Limit the number of leads to assign based on available capacity
    const leadsToAssignCount = Math.min(leadsToAssign.length, availableCapacity);
    const leadsToUpdate = leadsToAssign.slice(0, leadsToAssignCount);

    // Update leads
    const leadIdsToUpdate = leadsToUpdate.map(lead => lead._id);
    const updateResult = await Lead.updateMany(
      { _id: { $in: leadIdsToUpdate } },
      { 
        $set: { 
          assignedTo: brokerId,
          assignedAt: new Date(),
          status: 'assigned'
        }
      }
    );

    // Update broker's leadsAssigned counter
    await Broker.findByIdAndUpdate(brokerId, { 
      $inc: { leadsAssigned: leadsToAssignCount } 
    });

    return res.json({
      message: 'Leads assigned successfully',
      data: {
        assignedCount: leadsToAssignCount,
        totalRequested: leadsToAssign.length,
        brokerName: broker.name,
        brokerId: broker._id,
        newLeadsAssigned: currentLeadsAssigned + leadsToAssignCount,
        leadLimit: leadLimit,
        remainingCapacity: availableCapacity - leadsToAssignCount
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reassign leads from one broker to another
 * POST /api/leads/reassign-leads
 * Body: { fromBrokerId: string, toBrokerId: string, leadIds: string[] } (optional leadIds, if not provided reassigns all leads)
 */
exports.reassignLeadsToAnotherBroker = async (req, res, next) => {
  try {
    const { fromBrokerId, toBrokerId, leadIds } = req.body;

    if (!fromBrokerId || !toBrokerId) {
      return res.status(400).json({ message: 'fromBrokerId and toBrokerId are required' });
    }

    if (fromBrokerId === toBrokerId) {
      return res.status(400).json({ message: 'fromBrokerId and toBrokerId cannot be the same' });
    }

    // Verify both brokers exist
    const fromBroker = await Broker.findById(fromBrokerId);
    const toBroker = await Broker.findById(toBrokerId).populate('currentPackage');

    if (!fromBroker) {
      return res.status(404).json({ message: 'Source broker not found' });
    }

    if (!toBroker) {
      return res.status(404).json({ message: 'Destination broker not found' });
    }

    // Check if destination broker has an active package
    if (!toBroker.currentPackage) {
      return res.status(400).json({ message: 'Destination broker does not have an active package' });
    }

    // Build query for leads to reassign
    let query = { assignedTo: fromBrokerId };
    if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
      query._id = { $in: leadIds };
    }

    // Find leads to reassign
    const leadsToReassign = await Lead.find(query);

    if (leadsToReassign.length === 0) {
      return res.status(404).json({ message: 'No leads found assigned to the source broker' });
    }

    // Check destination broker's capacity
    const currentLeadsAssigned = toBroker.leadsAssigned || 0;
    const leadLimit = toBroker.currentPackage.leadLimit || 0;
    const availableCapacity = leadLimit - currentLeadsAssigned;

    if (availableCapacity <= 0) {
      return res.status(400).json({ 
        message: 'Destination broker has reached their lead limit',
        details: {
          currentLeadsAssigned,
          leadLimit,
          availableCapacity: 0
        }
      });
    }

    // Limit the number of leads to reassign based on available capacity
    const leadsToReassignCount = Math.min(leadsToReassign.length, availableCapacity);
    const leadsToUpdate = leadsToReassign.slice(0, leadsToReassignCount);

    // Update leads
    const leadIdsToUpdate = leadsToUpdate.map(lead => lead._id);
    const updateResult = await Lead.updateMany(
      { _id: { $in: leadIdsToUpdate } },
      { 
        $set: { 
          assignedTo: toBrokerId,
          assignedAt: new Date(),
          status: 'assigned'
        }
      }
    );

    // Update both brokers' leadsAssigned counters
    await Broker.findByIdAndUpdate(fromBrokerId, { 
      $inc: { leadsAssigned: -leadsToReassignCount } 
    });

    await Broker.findByIdAndUpdate(toBrokerId, { 
      $inc: { leadsAssigned: leadsToReassignCount } 
    });

    return res.json({
      message: 'Leads reassigned successfully',
      data: {
        reassignedCount: leadsToReassignCount,
        totalRequested: leadsToReassign.length,
        fromBroker: {
          name: fromBroker.name,
          id: fromBroker._id,
          newLeadsAssigned: (fromBroker.leadsAssigned || 0) - leadsToReassignCount
        },
        toBroker: {
          name: toBroker.name,
          id: toBroker._id,
          newLeadsAssigned: currentLeadsAssigned + leadsToReassignCount,
          leadLimit: leadLimit,
          remainingCapacity: availableCapacity - leadsToReassignCount
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
