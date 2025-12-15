
// models/LeadPackage.js
const mongoose = require('mongoose');

const LeadPackageSchema = new mongoose.Schema(
  {
    key: {                    // "basic", "pro", "premium", "enterprise"
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {                   // "Basic Lead Pack"
      type: String,
      required: true,
      trim: true,
    },

    // numbers
    leadsCount: {             // 30, 60, 100, 200
      type: Number,
      required: true,
    },
    price: {                  // 4999, 8999, ...
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },

    // UI-ish meta
    durationLabel: {          // "30 days", "60 days", etc
      type: String,
      required: true,
    },
    features: {               // ["30 verified leads", "Email support", ...]
      type: [String],
      default: [],
    },

    // Tailwind classes for styling
    gradientClass: {
      type: String,           // "from-blue-500 to-blue-600"
      default: '',
    },
    bgClass: {
      type: String,           // "bg-blue-50"
      default: '',
    },
    iconBgClass: {
      type: String,           // "bg-blue-500"
      default: '',
    },

    // which icon to pick on frontend (string, you map to actual component)
    iconKey: {
      type: String,           // "package", "zap", "crown", "trending-up"
      default: 'package',
    },

    popular: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    supportsSubscription: {
      type: Boolean,
      default: true,
    },
    razorpayPlanId: {
      type: String,
      default: null, // set from Razorpay dashboard
      trim: true,
    },
    billingInterval: {
      type: Number,
      default: 1, // 1 month
    },
    billingIntervalUnit: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      default: 'month',
    },
    autoRenewDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeadPackage', LeadPackageSchema);

