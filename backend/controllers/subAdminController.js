const SubAdmin = require('../models/SubAdmin');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (subAdminId) => {
  return jwt.sign(
    { id: subAdminId, role: 'sub-admin' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

/**
 * Sub-Admin Login
 * POST /api/sub-admins/login
 * Body: { email: string, password: string }
 */
exports.loginSubAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find sub-admin by email
    const subAdmin = await SubAdmin.findOne({ email: email.toLowerCase() });
    if (!subAdmin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if sub-admin is active
    if (!subAdmin.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Please contact admin.' });
    }

    // Verify password
    const isPasswordValid = await subAdmin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(subAdmin._id);

    return res.json({
      message: 'Login successful',
      token,
      data: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role,
        allowedRoutes: subAdmin.allowedRoutes
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Sub-Admin Profile
 * GET /api/sub-admins/profile
 * Requires authentication
 */
exports.getSubAdminProfile = async (req, res, next) => {
  try {
    // In a real implementation, you'd get this from auth middleware
    // For now, we'll accept it as a query parameter
    const { subAdminId } = req.query;

    if (!subAdminId) {
      return res.status(400).json({ message: 'subAdminId is required' });
    }

    const subAdmin = await SubAdmin.findById(subAdminId)
      .populate('assignedLeads', 'name phoneNumber address status')
      .populate('assignedBrokers', 'name phoneNumber serviceAreas');

    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    return res.json({
      message: 'Profile fetched successfully',
      data: subAdmin
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create Sub-Admin (Admin Only)
 * POST /api/sub-admins
 * Body: { name, email, password, phoneNumber, allowedRoutes }
 */
exports.createSubAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, allowedRoutes } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const existingSubAdmin = await SubAdmin.findOne({ email: email.toLowerCase() });
    if (existingSubAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create sub-admin
    const subAdmin = await SubAdmin.create({
      name,
      email: email.toLowerCase(),
      password,
      phoneNumber,
      allowedRoutes: allowedRoutes || []
    });

    return res.status(201).json({
      message: 'Sub-admin created successfully',
      data: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        phoneNumber: subAdmin.phoneNumber,
        allowedRoutes: subAdmin.allowedRoutes,
        isActive: subAdmin.isActive,
        role: subAdmin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Sub-Admins (Admin Only)
 * GET /api/sub-admins
 * Query: page, limit
 */
exports.getAllSubAdmins = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await SubAdmin.countDocuments();

    const subAdmins = await SubAdmin.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add counts for assigned resources
    const subAdminsWithCounts = subAdmins.map(subAdmin => ({
      ...subAdmin,
      assignedLeadsCount: subAdmin.assignedLeads?.length || 0,
      assignedBrokersCount: subAdmin.assignedBrokers?.length || 0
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return res.json({
      message: 'Sub-admins fetched successfully',
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount,
        totalPages,
        hasMore
      },
      data: subAdminsWithCounts
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Sub-Admin by ID (Admin Only)
 * GET /api/sub-admins/:subAdminId
 */
exports.getSubAdminById = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;

    const subAdmin = await SubAdmin.findById(subAdminId)
      .select('-password')
      .lean();

    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Get counts
    const assignedLeadsCount = subAdmin.assignedLeads?.length || 0;
    const assignedBrokersCount = subAdmin.assignedBrokers?.length || 0;

    return res.json({
      message: 'Sub-admin fetched successfully',
      data: {
        ...subAdmin,
        assignedLeadsCount,
        assignedBrokersCount
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Sub-Admin (Admin Only)
 * PUT /api/sub-admins/:subAdminId
 * Body: { name, email, password, phoneNumber, allowedRoutes, isActive }
 */
// exports.updateSubAdmin = async (req, res, next) => {
//   try {
//     const { subAdminId } = req.params;
//     const { name, email, password, phoneNumber, allowedRoutes, isActive } = req.body;

//     const subAdmin = await SubAdmin.findById(subAdminId);
//     if (!subAdmin) {
//       return res.status(404).json({ message: 'Sub-admin not found' });
//     }

//     // Update fields
//     if (name) subAdmin.name = name;
//     if (email) subAdmin.email = email.toLowerCase();
//     if (password) subAdmin.password = password; // Will be hashed by pre-save hook
//     if (phoneNumber !== undefined) subAdmin.phoneNumber = phoneNumber;
//     if (allowedRoutes) subAdmin.allowedRoutes = allowedRoutes;
//     if (isActive !== undefined) subAdmin.isActive = isActive;

//     await subAdmin.save();

//     return res.json({
//       message: 'Sub-admin updated successfully',
//       data: {
//         id: subAdmin._id,
//         name: subAdmin.name,
//         email: subAdmin.email,
//         phoneNumber: subAdmin.phoneNumber,
//         allowedRoutes: subAdmin.allowedRoutes,
//         isActive: subAdmin.isActive
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updateSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const {
      name,
      email,
      password,
      phoneNumber,
      allowedRoutes,
      isActive,
    } = req.body;

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Basic fields
    if (typeof name === 'string' && name.trim()) {
      subAdmin.name = name.trim();
    }

    if (typeof email === 'string' && email.trim()) {
      subAdmin.email = email.toLowerCase().trim();
    }

    // Only change password if a non-empty string is sent
    if (typeof password === 'string' && password.trim()) {
      subAdmin.password = password; // pre-save hook will hash
    }

    if (phoneNumber !== undefined) {
      subAdmin.phoneNumber = phoneNumber || '';
    }

    // Allowed routes must be an array
    if (Array.isArray(allowedRoutes)) {
      subAdmin.allowedRoutes = allowedRoutes;
    }

    // Active flag toggle
    if (typeof isActive === 'boolean') {
      subAdmin.isActive = isActive;
    }

    await subAdmin.save();

    return res.json({
      message: 'Sub-admin updated successfully',
      data: {
        id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        phoneNumber: subAdmin.phoneNumber,
        allowedRoutes: subAdmin.allowedRoutes,
        isActive: subAdmin.isActive,
      },
    });
  } catch (err) {
    next(err);
  }
};


/**
 * Delete Sub-Admin (Admin Only)
 * DELETE /api/sub-admins/:subAdminId
 */
exports.deleteSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;

    const subAdmin = await SubAdmin.findByIdAndDelete(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    return res.json({
      message: 'Sub-admin deleted successfully',
      data: { id: subAdmin._id, name: subAdmin.name }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign Leads to Sub-Admin (Admin Only)
 * POST /api/sub-admins/:subAdminId/assign-leads
 * Body: { leadIds: string[] }
 */
exports.assignLeadsToSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const { leadIds } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'leadIds array is required' });
    }

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Verify all leads exist
    const leads = await Lead.find({ _id: { $in: leadIds } });
    if (leads.length !== leadIds.length) {
      return res.status(404).json({ message: 'One or more leads not found' });
    }

    // Add leads to sub-admin (avoid duplicates)
    const newLeads = leadIds.filter(leadId => !subAdmin.assignedLeads.includes(leadId));
    subAdmin.assignedLeads.push(...newLeads);
    await subAdmin.save();

    return res.json({
      message: 'Leads assigned successfully',
      data: {
        subAdminId: subAdmin._id,
        subAdminName: subAdmin.name,
        assignedCount: newLeads.length,
        totalAssignedLeads: subAdmin.assignedLeads.length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove Leads from Sub-Admin (Admin Only)
 * POST /api/sub-admins/:subAdminId/remove-leads
 * Body: { leadIds: string[] }
 */
exports.removeLeadsFromSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const { leadIds } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'leadIds array is required' });
    }

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Remove leads from sub-admin
    const initialCount = subAdmin.assignedLeads.length;
    subAdmin.assignedLeads = subAdmin.assignedLeads.filter(
      leadId => !leadIds.includes(leadId.toString())
    );
    await subAdmin.save();

    const removedCount = initialCount - subAdmin.assignedLeads.length;

    return res.json({
      message: 'Leads removed successfully',
      data: {
        subAdminId: subAdmin._id,
        subAdminName: subAdmin.name,
        removedCount,
        remainingLeads: subAdmin.assignedLeads.length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Sub-Admin's Leads
 * GET /api/sub-admins/:subAdminId/leads
 * Query: page, limit
 */
exports.getSubAdminLeads = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    const totalCount = subAdmin.assignedLeads.length;

    // Get paginated leads
    const leadIds = subAdmin.assignedLeads.slice(skip, skip + limit);
    const leads = await Lead.find({ _id: { $in: leadIds } })
      .populate('assignedTo', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return res.json({
      message: 'Leads fetched successfully',
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount,
        totalPages,
        hasMore
      },
      data: leads
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign Brokers to Sub-Admin (Admin Only)
 * POST /api/sub-admins/:subAdminId/assign-brokers
 * Body: { brokerIds: string[] }
 */
exports.assignBrokersToSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const { brokerIds } = req.body;

    if (!brokerIds || !Array.isArray(brokerIds) || brokerIds.length === 0) {
      return res.status(400).json({ message: 'brokerIds array is required' });
    }

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Verify all brokers exist
    const brokers = await Broker.find({ _id: { $in: brokerIds } });
    if (brokers.length !== brokerIds.length) {
      return res.status(404).json({ message: 'One or more brokers not found' });
    }

    // Add brokers to sub-admin (avoid duplicates)
    const newBrokers = brokerIds.filter(brokerId => !subAdmin.assignedBrokers.includes(brokerId));
    subAdmin.assignedBrokers.push(...newBrokers);
    await subAdmin.save();

    return res.json({
      message: 'Brokers assigned successfully',
      data: {
        subAdminId: subAdmin._id,
        subAdminName: subAdmin.name,
        assignedCount: newBrokers.length,
        totalAssignedBrokers: subAdmin.assignedBrokers.length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove Brokers from Sub-Admin (Admin Only)
 * POST /api/sub-admins/:subAdminId/remove-brokers
 * Body: { brokerIds: string[] }
 */
exports.removeBrokersFromSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const { brokerIds } = req.body;

    if (!brokerIds || !Array.isArray(brokerIds) || brokerIds.length === 0) {
      return res.status(400).json({ message: 'brokerIds array is required' });
    }

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Remove brokers from sub-admin
    const initialCount = subAdmin.assignedBrokers.length;
    subAdmin.assignedBrokers = subAdmin.assignedBrokers.filter(
      brokerId => !brokerIds.includes(brokerId.toString())
    );
    await subAdmin.save();

    const removedCount = initialCount - subAdmin.assignedBrokers.length;

    return res.json({
      message: 'Brokers removed successfully',
      data: {
        subAdminId: subAdmin._id,
        subAdminName: subAdmin.name,
        removedCount,
        remainingBrokers: subAdmin.assignedBrokers.length
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Sub-Admin's Brokers
 * GET /api/sub-admins/:subAdminId/brokers
 * Query: page, limit
 */
exports.getSubAdminBrokers = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    const totalCount = subAdmin.assignedBrokers.length;

    // Get paginated brokers
    const brokerIds = subAdmin.assignedBrokers.slice(skip, skip + limit);
    const brokers = await Broker.find({ _id: { $in: brokerIds } })
      .populate('currentPackage', 'name leadLimit')
      .sort({ createdAt: -1 })
      .lean();

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return res.json({
      message: 'Brokers fetched successfully',
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount,
        totalPages,
        hasMore
      },
      data: brokers
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Sub-Admin Dashboard
 * GET /api/sub-admins/:subAdminId/dashboard
 */
exports.getSubAdminDashboard = async (req, res, next) => {
  try {
    const { subAdminId } = req.params;

    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found' });
    }

    // Get lead statistics
    const leads = await Lead.find({ _id: { $in: subAdmin.assignedLeads } });
    const leadStats = {
      total: leads.length,
      open: leads.filter(l => l.status === 'open').length,
      assigned: leads.filter(l => l.status === 'assigned').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      closed: leads.filter(l => l.status === 'closed').length
    };

    // Get broker statistics
    const brokers = await Broker.find({ _id: { $in: subAdmin.assignedBrokers } })
      .populate('currentPackage');
    
    const brokerStats = {
      total: brokers.length,
      withPackages: brokers.filter(b => b.currentPackage).length,
      withoutPackages: brokers.filter(b => !b.currentPackage).length,
      totalLeadsAssigned: brokers.reduce((sum, b) => sum + (b.leadsAssigned || 0), 0)
    };

    return res.json({
      message: 'Dashboard data fetched successfully',
      data: {
        subAdmin: {
          id: subAdmin._id,
          name: subAdmin.name,
          email: subAdmin.email,
          isActive: subAdmin.isActive,
          allowedRoutes: subAdmin.allowedRoutes
        },
        leadStats,
        brokerStats
      }
    });
  } catch (err) {
    next(err);
  }
};
