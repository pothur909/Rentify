const Package = require('../models/Package');
const Broker = require('../models/Broker');
const LeadPackage = require('../models/LeadPackage');
const Lead = require('../models/Lead');
const { assignLeadIfPossible } = require('../services/leadAssignmentWatcher');

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

    // Calculate package expiry date from durationLabel
    const durationMatch = pkg.durationLabel?.match(/(\d+)\s*days?/i);
    const durationDays = durationMatch ? parseInt(durationMatch[1], 10) : 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    broker.packageExpiresAt = expiryDate;

    // Add entry to packageHistory for tracking
    // Skip for subscriptions to avoid duplicates (webhook will create it)
    const isSubscription = req.body.autoRenew === true || req.body.autoRenew === 'true';
    
    if (!isSubscription) {
      const packageHistoryEntry = {
        packageId: pkg._id,
        transactionId: null,
        packageType: pkg.name || pkg.key,
        totalLeads: pkg.leadsCount,
        leadsAssigned: 0,
        pendingLeads: 0,
        carriedForwardLeads: 0,
        startDate: new Date(),
        endDate: expiryDate,
        status: 'active',
        isCarryForward: false,
        subscriptionType: 'one_time',
        subscriptionId: null
      };
      
      broker.packageHistory.push(packageHistoryEntry);
    }

    await broker.save();
    
    // Recalculate broker totals after adding new package
    const { recalculateBrokerTotals } = require('../services/leadAssignmentWatcher');
    await recalculateBrokerTotals(brokerId);
    
    await broker.populate('currentPackage');

    // 4. Automatically assign open leads after 30 seconds
    setTimeout(async () => {
      try {
        console.log(`Starting delayed lead assignment for broker ${brokerId} after 30 seconds...`);
        
        // Find all open leads
        const openLeads = await Lead.find({ 
          status: 'open',
          $or: [
            { assignedTo: null },
            { assignedTo: { $exists: false } }
          ]
        }).lean();

        console.log(`Found ${openLeads.length} open leads to process for broker ${brokerId}`);

        let assignedCount = 0;
        // Try to assign each open lead
        for (const lead of openLeads) {
          try {
            // Check if broker has capacity remaining
            const currentBroker = await Broker.findById(brokerId);
            if (currentBroker.leadsAssigned >= pkg.leadsCount) {
              console.log(`Broker ${brokerId} has reached lead capacity`);
              break; // Stop if broker has reached capacity
            }

            // Try to assign this lead (assignLeadIfPossible handles all the logic)
            await assignLeadIfPossible(lead);
            
            // Check if the lead was actually assigned to this broker
            const updatedLead = await Lead.findById(lead._id);
            if (updatedLead && updatedLead.assignedTo && updatedLead.assignedTo.toString() === brokerId.toString()) {
              assignedCount++;
            }
          } catch (err) {
            console.error(`Error assigning lead ${lead._id}:`, err.message);
            // Continue with next lead even if one fails
          }
        }

        console.log(`Successfully assigned ${assignedCount} leads to broker ${brokerId} after 30-second delay`);
      } catch (err) {
        console.error('Error during delayed lead assignment:', err.message);
      }
    }, 30000); // 30 seconds delay

    return res.json({
      success: true,
      message: 'Lead package assigned successfully. Matching leads will be assigned in 30 seconds.',
      data: {
        brokerId: broker._id,
        brokerName: broker.name,
        package: broker.currentPackage,
        packagePurchasedAt: broker.packagePurchasedAt,
        leadsAssigned: broker.leadsAssigned,
        leadLimit: broker.currentLeadLimit,
        note: 'Open leads matching your service areas will be automatically assigned in 30 seconds',
      },
    });
  } catch (err) {
    next(err);
  }
};

