
const LeadPackage = require('../models/LeadPackage');

// GET /api/lead-packages
exports.getAllLeadPackages = async (req, res) => {
  try {
    const packages = await LeadPackage.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: packages,
    });
  } catch (err) {
    console.error('Error fetching lead packages', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lead packages',
      error: err.message,
    });
  }
};

// GET /api/lead-packages/key/:key
exports.getLeadPackageByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const pkg = await LeadPackage.findOne({ key, isActive: true }).lean();

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Lead package not found',
      });
    }

    return res.json({
      success: true,
      data: pkg,
    });
  } catch (err) {
    console.error('Error fetching lead package', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lead package',
      error: err.message,
    });
  }
};

// GET /api/lead-packages/:id
exports.getLeadPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await LeadPackage.findById(id).lean();

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Lead package not found',
      });
    }

    return res.json({
      success: true,
      data: pkg,
    });
  } catch (err) {
    console.error('Error fetching lead package by id', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lead package',
      error: err.message,
    });
  }
};

// POST /api/lead-packages
// Body: single package object
exports.createLeadPackage = async (req, res) => {
  try {
    const body = req.body;

    const existing = await LeadPackage.findOne({ key: body.key });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Package with this key already exists',
      });
    }

    const pkg = await LeadPackage.create(body);

    return res.status(201).json({
      success: true,
      data: pkg,
    });
  } catch (err) {
    console.error('Error creating lead package', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create lead package',
      error: err.message,
    });
  }
};

// POST /api/lead-packages/bulk
// Body: array of packages (no upsert, plain insert)
exports.createLeadPackagesBulk = async (req, res) => {
  try {
    const packages = Array.isArray(req.body) ? req.body : [];

    if (!packages.length) {
      return res.status(400).json({
        success: false,
        message: 'Expected an array of packages in request body',
      });
    }

    // will throw if duplicate keys hit unique index
    const inserted = await LeadPackage.insertMany(packages);

    return res.status(201).json({
      success: true,
      message: 'Lead packages created',
      data: inserted,
    });
  } catch (err) {
    console.error('Error creating lead packages in bulk', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create lead packages in bulk',
      error: err.message,
    });
  }
};

// POST /api/lead-packages/seed
// Body: array of packages (upsert by key)

exports.seedLeadPackages = async (req, res) => {
  try {
    const input = Array.isArray(req.body) ? req.body : [];

    if (!input.length) {
      return res.status(400).json({
        success: false,
        message: 'Expected an array of packages in request body',
      });
    }

    const results = [];

    for (const raw of input) {
      const pkg = {
        key: raw.key,
        name: raw.name,
        leadsCount: raw.leadsCount,
        price: raw.price,
        currency: raw.currency || 'INR',
        durationLabel: raw.durationLabel,
        features: raw.features || [],
        popular: !!raw.popular,
        sortOrder: raw.sortOrder ?? 0,
        isActive: raw.isActive ?? true,

        // use the exact fields from body
        gradientClass: raw.gradientClass || '',
        bgClass: raw.bgClass || '',
        iconBgClass: raw.iconBgClass || '',
        iconKey: raw.iconKey || 'package',

        supportsSubscription: raw.supportsSubscription ?? true,
        razorpayPlanId: raw.razorpayPlanId || null,
        billingInterval: raw.billingInterval ?? 1,
        billingIntervalUnit: raw.billingIntervalUnit || 'month',
        autoRenewDefault: raw.autoRenewDefault ?? false,
      };

      const updated = await LeadPackage.findOneAndUpdate(
        { key: pkg.key },
        { $set: pkg },
        { upsert: true, new: true }
      );

      results.push(updated);
    }

    return res.json({
      success: true,
      message: 'Packages seeded or updated successfully',
      data: results,
    });
  } catch (err) {
    console.error('Error seeding lead packages', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed lead packages',
      error: err.message,
    });
  }
};



// PUT /api/lead-packages/:id
// Body: fields to update
exports.updateLeadPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const pkg = await LeadPackage.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Lead package not found',
      });
    }

    return res.json({
      success: true,
      data: pkg,
    });
  } catch (err) {
    console.error('Error updating lead package', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead package',
      error: err.message,
    });
  }
};

// DELETE /api/lead-packages/:id
// Soft delete: set isActive = false
exports.deleteLeadPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await LeadPackage.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Lead package not found',
      });
    }

    return res.json({
      success: true,
      message: 'Lead package deactivated',
      data: pkg,
    });
  } catch (err) {
    console.error('Error deleting lead package', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead package',
      error: err.message,
    });
  }
};



const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function normalizePlanPeriod(unit) {
  const u = String(unit || "").toLowerCase().trim();

  // allow both styles from DB/admin
  if (u === "day" || u === "daily") return "daily";
  if (u === "week" || u === "weekly") return "weekly";
  if (u === "month" || u === "monthly") return "monthly";
  if (u === "year" || u === "yearly") return "yearly";

  return null;
}

// POST /api/lead-packages/:id/create-plan
exports.createRazorpayPlanForPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await LeadPackage.findById(id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }

    if (!pkg.supportsSubscription) {
      return res.status(400).json({
        success: false,
        message: "This package does not support subscriptions",
      });
    }

    if (pkg.razorpayPlanId) {
      return res.json({
        success: true,
        message: "Plan already exists",
        razorpayPlanId: pkg.razorpayPlanId,
      });
    }

    const period = normalizePlanPeriod(pkg.billingIntervalUnit);
    if (!period) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid billingIntervalUnit. Use day/week/month/year (or daily/weekly/monthly/yearly).",
      });
    }

    const interval = Number(pkg.billingInterval || 1);
    if (!Number.isFinite(interval) || interval <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid billingInterval. Must be a positive number.",
      });
    }

    const amountPaise = Math.round(Number(pkg.price) * 100);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price. Must be a positive number.",
      });
    }

    const plan = await razorpay.plans.create({
      period, // daily|weekly|monthly|yearly
      interval,
      item: {
        name: `${pkg.name} Subscription`,
        amount: amountPaise,
        currency: pkg.currency || "INR",
        description: `Subscription for ${pkg.key}`,
      },
      notes: {
        packageId: String(pkg._id),
        packageKey: pkg.key,
      },
    });

    pkg.razorpayPlanId = plan.id;
    await pkg.save();

    return res.json({
      success: true,
      message: "Plan created and saved",
      razorpayPlanId: plan.id,
      plan,
    });
  } catch (err) {
    console.error("Plan creation error", err);
    const msg =
      err?.error?.description || err?.message || "Failed to create plan";
    return res.status(500).json({
      success: false,
      message: "Failed to create plan",
      error: msg,
    });
  }
};
