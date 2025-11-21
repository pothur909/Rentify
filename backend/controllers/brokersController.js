const Broker = require('../models/Broker');
const Lead = require('../models/Lead');
const Package = require('../models/Package');

exports.signup = async (req, res, next) => {
  try {
    const { name, phoneNumber, serviceAreas, availableFlatTypes, address } = req.body;
    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'name and phoneNumber are required' });
    }

    const existing = await Broker.findOne({ phoneNumber });
    if (existing) {
      return res.status(409).json({ message: 'Broker already exists with this phone number' });
    }

    const broker = await Broker.create({
      name,
      phoneNumber,
      serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? [serviceAreas] : []),
      availableFlatTypes: Array.isArray(availableFlatTypes) ? availableFlatTypes : (availableFlatTypes ? [availableFlatTypes] : []),
      address,
    });

    return res.status(201).json({ message: 'Broker signed up', data: broker });
  } catch (err) {
    next(err);
  }
};

exports.requestOtp = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'phoneNumber is required' });
    }

    const broker = await Broker.findOne({ phoneNumber });
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found. Please sign up first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    broker.otpCode = otp;
    broker.otpExpires = expires;
    await broker.save();

    console.log(`OTP for ${phoneNumber}: ${otp} (expires at ${expires.toISOString()})`);

    return res.json({ message: 'OTP sent (check server logs in this demo)' });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'phoneNumber and otp are required' });
    }

    const broker = await Broker.findOne({ phoneNumber });
    if (!broker || !broker.otpCode || !broker.otpExpires) {
      return res.status(400).json({ message: 'OTP not requested or invalid' });
    }

    if (broker.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (broker.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    broker.otpCode = undefined;
    broker.otpExpires = undefined;
    await broker.save();

    return res.json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};

exports.getAssignedLeads = async (req, res, next) => {
  try {
    const { brokerId } = req.params;
    
    if (!brokerId) {
      return res.status(400).json({ message: 'brokerId is required' });
    }

    // Verify broker exists and populate package
    const broker = await Broker.findById(brokerId).populate('currentPackage');
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    // Get all leads assigned to this broker
    const leads = await Lead.find({ assignedTo: brokerId })
      .sort({ assignedAt: -1 }); // Sort by most recently assigned first

    // Calculate remaining leads
    const leadsRemaining = broker.currentPackage 
      ? broker.currentPackage.leadLimit - broker.leadsAssigned 
      : 0;

    return res.json({ 
      message: 'Assigned leads retrieved successfully',
      count: leads.length,
      data: leads,
      packageInfo: broker.currentPackage ? {
        packageName: broker.currentPackage.name,
        leadLimit: broker.currentPackage.leadLimit,
        leadsAssigned: broker.leadsAssigned,
        leadsRemaining: leadsRemaining
      } : null
    });
  } catch (err) {
    next(err);
  }
};

exports.purchasePackage = async (req, res, next) => {
  try {
    const { brokerId } = req.params;
    const { packageId } = req.body;

    if (!brokerId || !packageId) {
      return res.status(400).json({ message: 'brokerId and packageId are required' });
    }

    // Verify broker exists
    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    // Verify package exists and is active
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (!package.isActive) {
      return res.status(400).json({ message: 'Package is not available for purchase' });
    }

    // Update broker with new package
    broker.currentPackage = packageId;
    broker.packagePurchasedAt = new Date();
    broker.leadsAssigned = 0; // Reset lead counter
    await broker.save();

    // Populate package details for response
    await broker.populate('currentPackage');

    return res.json({
      message: 'Package purchased successfully',
      data: {
        broker: {
          id: broker._id,
          name: broker.name,
          phoneNumber: broker.phoneNumber
        },
        package: {
          id: broker.currentPackage._id,
          name: broker.currentPackage.name,
          leadLimit: broker.currentPackage.leadLimit,
          price: broker.currentPackage.price
        },
        purchasedAt: broker.packagePurchasedAt,
        leadsRemaining: broker.currentPackage.leadLimit
      }
    });
  } catch (err) {
    next(err);
  }
};
