const Package = require('../models/Package');
const Broker = require('../models/Broker');
const LeadPackage = require('../models/LeadPackage');

// Get all active packages
exports.getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ price: 1 });
    return res.json({
      message: 'Packages retrieved successfully',
      count: packages.length,
      data: packages
    });
  } catch (err) {
    next(err);
  }
};

// Create a new package (admin)
exports.createPackage = async (req, res, next) => {
  try {
    const { name, leadLimit, price } = req.body;
    
    if (!name || !leadLimit || price === undefined) {
      return res.status(400).json({ 
        message: 'name, leadLimit, and price are required' 
      });
    }

    const package = await Package.create({
      name,
      leadLimit,
      price,
      isActive: true
    });

    return res.status(201).json({
      message: 'Package created successfully',
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// Update a package (admin)
exports.updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, leadLimit, price, isActive } = req.body;

    const package = await Package.findByIdAndUpdate(
      id,
      { name, leadLimit, price, isActive },
      { new: true, runValidators: true }
    );

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    return res.json({
      message: 'Package updated successfully',
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// Delete (deactivate) a package (admin)
exports.deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const package = await Package.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    return res.json({
      message: 'Package deactivated successfully',
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// Assign a package to a broker
// exports.assignPackageToBroker = async (req, res, next) => {
//   try {
//     const { brokerId, packageId } = req.body;

//     if (!brokerId || !packageId) {
//       return res.status(400).json({ 
//         message: 'brokerId and packageId are required' 
//       });
//     }

//     // Check if broker exists
//     const broker = await Broker.findById(brokerId);
//     if (!broker) {
//       return res.status(404).json({ message: 'Broker not found' });
//     }

//     // Check if package exists and is active
//     const package = await Package.findById(packageId);
//     if (!package) {
//       return res.status(404).json({ message: 'Package not found' });
//     }
//     if (!package.isActive) {
//       return res.status(400).json({ message: 'Package is not active' });
//     }

//     // Assign package to broker
//     broker.currentPackage = packageId;
//     broker.packagePurchasedAt = new Date();
//     broker.leadsAssigned = 0; // Reset leads count for new package
//     await broker.save();

//     // Populate package details for response
//     await broker.populate('currentPackage');

//     return res.json({
//       message: 'Package assigned to broker successfully',
//       data: {
//         brokerId: broker._id,
//         brokerName: broker.name,
//         package: broker.currentPackage,
//         packagePurchasedAt: broker.packagePurchasedAt,
//         leadsAssigned: broker.leadsAssigned
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// assignLeadPackageToBroker controller is in use in razorPayment.controller.js , and other controllers are not used, insted of this we use leadPackage.controller.js

exports.assignLeadPackageToBroker = async (req, res, next) => {
  try {
    const { brokerId, packageId, packageKey } = req.body;

    if (!brokerId || (!packageId && !packageKey)) {
      return res.status(400).json({
        success: false,
        message: 'brokerId and (packageId or packageKey) are required',
      });
    }

    // 1. Broker check
    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found',
      });
    }

    // 2. Find LeadPackage by id or key
    let pkg;
    if (packageId) {
      pkg = await LeadPackage.findById(packageId);
    } else if (packageKey) {
      pkg = await LeadPackage.findOne({ key: packageKey });
    }

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Lead package not found',
      });
    }

    if (!pkg.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Lead package is not active',
      });
    }

    // 3. Assign package to broker
    broker.currentPackage = pkg._id;
    broker.currentLeadLimit = pkg.leadsCount; // optional but useful
    broker.packagePurchasedAt = new Date();
    broker.leadsAssigned = 0; // reset for new purchase

    await broker.save();
    await broker.populate('currentPackage');

    return res.json({
      success: true,
      message: 'Lead package assigned to broker successfully',
      data: {
        brokerId: broker._id,
        brokerName: broker.name,
        package: broker.currentPackage,
        packagePurchasedAt: broker.packagePurchasedAt,
        leadsAssigned: broker.leadsAssigned,
        leadLimit: broker.currentLeadLimit,
      },
    });
  } catch (err) {
    next(err);
  }
};

