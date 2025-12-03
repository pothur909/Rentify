const Broker = require('../models/Broker');
const Lead = require('../models/Lead');
const Package = require('../models/Package');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const PaymentTransaction = require('../models/PaymentTransaction'); 

exports.signup = async (req, res, next) => {
  try {
    const { name, phoneNumber, serviceAreas, availableFlatTypes, address,
            monthlyFlatsAvailable,      
      customerExpectations        

     } = req.body;
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
         monthlyFlatsAvailable: monthlyFlatsAvailable
        ? Number(monthlyFlatsAvailable)
        : 0,
      customerExpectations: customerExpectations || '',
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

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // broker.otpCode = otp;
    // broker.otpExpires = expires;
    // await broker.save();

    // console.log(`OTP for ${phoneNumber}: ${otp} (expires at ${expires.toISOString()})`);

 const otp = "999999";  // hardcoded OTP for dev
const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour, or whatever you want

broker.otpCode = otp;
broker.otpExpires = expires;
await broker.save();

console.log(`OTP for ${phoneNumber}: ${otp} (expires at ${expires.toISOString()})`);


    return res.json({ message: 'OTP sent (check server logs in this demo)' });
  } catch (err) {
    next(err);
  }
};

// exports.verifyOtp = async (req, res, next) => {
//   try {
//     const { phoneNumber, otp } = req.body;
//     if (!phoneNumber || !otp) {
//       return res.status(400).json({ message: 'phoneNumber and otp are required' });
//     }

//     const broker = await Broker.findOne({ phoneNumber });
//     if (!broker || !broker.otpCode || !broker.otpExpires) {
//       return res.status(400).json({ message: 'OTP not requested or invalid' });
//     }

//     if (broker.otpExpires < new Date()) {
//       return res.status(400).json({ message: 'OTP expired' });
//     }

//     if (broker.otpCode !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     // Clear OTP after successful verification
//     broker.otpCode = undefined;
//     broker.otpExpires = undefined;
//     await broker.save();

//     return res.json({ message: 'Login successful' });
//   } catch (err) {
//     next(err);
//   }
// };


// Request OTP for signup

 // replace with your secret

exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // if (!phoneNumber || !otp) {
    //   return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
    // }

    // Ensure +91 prefix
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

    const broker = await Broker.findOne({ phoneNumber: formattedPhone });
    if (!broker || !broker.otpCode || !broker.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP not requested or invalid" });
    }

    // if (broker.otpExpires < new Date()) {
    //   return res.status(400).json({ success: false, message: "OTP expired" });
    // }

    // if (broker.otpCode !== otp) {
    //   return res.status(400).json({ success: false, message: "Invalid OTP" });
    // }

    // // Clear OTP
    // broker.otpCode = undefined;
    // broker.otpExpires = undefined;
    // await broker.save();

      // HARD CODED OTP CHECK
    if (otp !== "999999") {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }


    // Generate JWT
    const token = jwt.sign({ brokerId: broker._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      broker: {
        _id: broker._id,
        name: broker.name,
        phoneNumber: broker.phoneNumber,
        serviceAreas: broker.serviceAreas,
        availableFlatTypes: broker.availableFlatTypes,
        address: broker.address,
        monthlyFlatsAvailable: broker.monthlyFlatsAvailable,   // NEW
        customerExpectations: broker.customerExpectations,
         profileImageUrl: broker.profileImageUrl || null,
      }
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
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
      ? broker.currentPackage.leadsCount - broker.leadsAssigned 
      : 0;

    // return res.json({ 
    //   message: 'Assigned leads retrieved successfully',
    //   count: leads.length,
    //   data: leads.map(lead => {
    //     const isContacted = lead.status === 'contacted';
    //     return {
    //       ...lead.toObject(),
    //       name: isContacted ? lead.name : null,
    //       phoneNumber: isContacted ? lead.phoneNumber : null
    //     };
    //   }),
    //   packageInfo: broker.currentPackage ? {
    //     packageName: broker.currentPackage.name,
    //     leadLimit: broker.currentPackage.leadLimit,
    //     leadsAssigned: broker.leadsAssigned,
    //     leadsRemaining: leadsRemaining
    //   } : null
    // });

    return res.json({
  message: 'Assigned leads retrieved successfully',
  count: leads.length,
  data: leads.map(lead => {
    const plain = lead.toObject();
    const isContacted = plain.status === 'contacted';

    const history = plain.contactHistory || [];
    const latestContactHistory =
      history.length > 0 ? history[history.length - 1] : null;

    return {
      ...plain,
      // main masking still depends only on main status
      name: isContacted ? plain.name : null,
      phoneNumber: isContacted ? plain.phoneNumber : null,
      latestContactHistory, // purely extra field
    };
  }),
  packageInfo: broker.currentPackage
    ? {
        packageName: broker.currentPackage.name,
        leadLimit: broker.currentPackage.leadLimit,
        leadsAssigned: broker.leadsAssigned,
        leadsRemaining: leadsRemaining,
      }
    : null,
});

  } catch (err) {
    next(err);
  }
};


//////////purchase package controller is not in use and also the package import also const Package = require('../models/Package'); ////////////

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

// exports.getAllBrokersForAdmin = async (req, res, next) => {
//   try {
//     // Get pagination parameters from query string
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Get total count for pagination metadata
//     const totalCount = await Broker.countDocuments();

//     // Fetch paginated brokers
//     const brokers = await Broker.find()
//       .populate('currentPackage', 'name leadLimit price isActive')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Calculate pagination metadata
//     const totalPages = Math.ceil(totalCount / limit);
//     const hasMore = page < totalPages;

//     return res.json({ 
//       message: 'Brokers fetched successfully', 
//       pagination: {
//         currentPage: page,
//         pageSize: limit,
//         totalCount: totalCount,
//         totalPages: totalPages,
//         hasMore: hasMore
//       },
//       data: brokers
//     });
//   } catch (err) {
//     next(err);
//   }
// };



// exports.getBrokerDashboardStats = async (req, res, next) => {
//   try {
//     const { brokerId } = req.params;

//     if (!brokerId) {
//       return res.status(400).json({ message: 'brokerId is required' });
//     }

//     // find broker and populate current package
//     const broker = await Broker.findById(brokerId).populate('currentPackage');
//     if (!broker) {
//       return res.status(404).json({ message: 'Broker not found' });
//     }

//     // lead stats
//     const totalLeads = await Lead.countDocuments({ assignedTo: brokerId });
//     const contactedLeads = await Lead.countDocuments({
//       assignedTo: brokerId,
//       status: 'contacted',
//     });
//     const closedLeads = await Lead.countDocuments({
//       assignedTo: brokerId,
//       status: 'closed',
//     });

//     // "upcoming" = assigned but not contacted/closed
// const upcomingLeads = Math.max(
//   totalLeads - contactedLeads - closedLeads,
//   0
// );

//     // package stats from payment transactions
//     const totalPackagesPurchased = await PaymentTransaction.countDocuments({
//       brokerId,
//       status: 'paid',
//     });

//     const lastPaidTxn = await PaymentTransaction.findOne({
//       brokerId,
//       status: 'paid',
//     })
//       .sort({ paidAt: -1 })
//       .populate('packageId', 'name leadsCount price durationLabel');

//     return res.json({
//       message: 'Dashboard stats fetched successfully',
//       data: {
//         broker: {
//           id: broker._id,
//           name: broker.name,
//           phoneNumber: broker.phoneNumber,
//         },
//         leads: {
//           total: totalLeads,
//           contacted: contactedLeads,
//           closed: closedLeads,
//           upcoming: upcomingLeads,
//         },
//         package: {
//           current: broker.currentPackage
//             ? {
//                 id: broker.currentPackage._id,
//                 name: broker.currentPackage.name,
//                 leadsCount: broker.currentPackage.leadsCount,
//                 price: broker.currentPackage.price,
//                 durationLabel: broker.currentPackage.durationLabel,
//                 purchasedAt: broker.packagePurchasedAt || null,
//                 leadsAssigned: broker.leadsAssigned || 0,
//                 leadsRemaining: broker.currentPackage.leadsCount
//                   ? Math.max(
//                       broker.currentPackage.leadsCount - (broker.leadsAssigned || 0),
//                       0
//                     )
//                   : 0,
//               }
//             : null,
//           totalPurchased: totalPackagesPurchased,
//           lastPurchase: lastPaidTxn
//             ? {
//                 id: lastPaidTxn._id,
//                 packageId: lastPaidTxn.packageId?._id,
//                 packageName: lastPaidTxn.packageId?.name,
//                 amount: lastPaidTxn.amount,
//                 currency: lastPaidTxn.currency,
//                 paidAt: lastPaidTxn.paidAt,
//               }
//             : null,
//         },
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getAllBrokersForAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Broker.countDocuments();

    const brokers = await Broker.find()
      .populate('currentPackage', 'name leadsCount price isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // aggregate lead stats per broker
    const leadStats = await Lead.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          newLeads: {
            $sum: {
              $cond: [{ $eq: ['$status', 'assigned'] }, 1, 0],
            },
          },
          contacted: {
            $sum: {
              $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const statsMap = {};
    for (const s of leadStats) {
      if (!s._id) continue;
      const key = s._id.toString();
      statsMap[key] = {
        totalAssigned: s.totalAssigned || 0,
        newLeads: s.newLeads || 0,
        contacted: s.contacted || 0,
      };
    }

    const enriched = brokers.map(b => {
      const key = b._id.toString();
      const agg = statsMap[key] || {
        totalAssigned: 0,
        newLeads: 0,
        contacted: 0,
      };

      const packageTotalLeads = b.currentPackage
        ? b.currentPackage.leadsCount || 0
        : 0;

      // const leadsAssignedCounter = b.leadsAssigned || 0;

      // // remaining = total from package - already assigned (counter)
      // const remainingLeads = Math.max(
      //   packageTotalLeads - leadsAssignedCounter,
      //   0
      // );

      const assignedByCounter = b.leadsAssigned || 0;

const remainingLeads = Math.max(
  packageTotalLeads - assignedByCounter,
  0
)

      return {
        ...b,
        stats: {
          packageTotalLeads,
          remainingLeads,
          newLeads: agg.newLeads,
          contacted: agg.contacted,
          totalAssigned: agg.totalAssigned,
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return res.json({
      message: 'Brokers fetched successfully',
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount,
        totalPages,
        hasMore,
      },
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBrokerDashboardStats = async (req, res, next) => {
  try {
    const { brokerId } = req.params;

    if (!brokerId) {
      return res.status(400).json({ message: 'brokerId is required' });
    }

    const broker = await Broker.findById(brokerId).populate('currentPackage');

    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }

    // counts in parallel
    const [contactedLeads, closedLeads, totalAssignedLeads, totalPaidPackages] =
      await Promise.all([
        Lead.countDocuments({ assignedTo: brokerId, status: 'contacted' }),
        Lead.countDocuments({ assignedTo: brokerId, status: 'closed' }),
        Lead.countDocuments({ assignedTo: brokerId }), // all leads assigned to this broker
        PaymentTransaction.countDocuments({
          brokerId,
          status: 'paid',
        }),
      ]);

    // package stats
    const leadLimit = broker.currentPackage
      ? broker.currentPackage.leadsCount || 0
      : 0;

    const leadsAssigned = broker.leadsAssigned || 0;

    // upcoming = remaining capacity from package
    const remainingCapacity = Math.max(leadLimit - leadsAssigned, 0);

    return res.json({
      message: 'Dashboard stats fetched successfully',
      data: {
        broker: {
          _id: broker._id,
          name: broker.name,
          phoneNumber: broker.phoneNumber,
        },
        leads: {
          // these are real lead counts in DB
          contacted: contactedLeads,
          closed: closedLeads,
          assigned: totalAssignedLeads,
        },
        package: {
          hasActivePackage: !!broker.currentPackage,
          leadLimit,                 // this is your "total leads" for UI
          leadsAssigned,             // how many already assigned
          remainingCapacity,         // this is your "upcoming" for UI
          totalPurchased: totalPaidPackages,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};