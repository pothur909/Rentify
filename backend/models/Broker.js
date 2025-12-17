const mongoose = require('mongoose');

const BrokerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    serviceAreas: { type: [String], default: [] },
    availableFlatTypes: { type: [String], default: [] },
    address: { type: String, trim: true },

    monthlyFlatsAvailable: { type: Number, default: 0 },          // optional
    customerExpectations: { type: String, trim: true },           // optional

    profilePicture: {
      type: String, // final S3 URL
      default: null,
    },

    otpCode: { type: String },
    otpExpires: { type: Date },
    paymentIds: {
      type: [String],
      default: [],
    },
    currentPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadPackage' },
    packagePurchasedAt: { type: Date },
    packageExpiresAt: { type: Date },
    leadsAssigned: { type: Number, default: 0 },
    fcmTokens: {
      type: [String],
      default: [],
    },
    currentLeadLimit: {
  type: Number,
  default: 0,
},
    
    // Package history tracking with carry-forward support
    packageHistory: [{
      packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadPackage' },
      transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' },
      packageType: String,              // e.g., "Basic", "Pro", "Premium"
      totalLeads: Number,               // Total leads in package (e.g., 30, 60, 100)
      leadsAssigned: { type: Number, default: 0 },
      pendingLeads: { type: Number, default: 0 },  // Unfulfilled leads
      carriedForwardLeads: { type: Number, default: 0 }, // Leads brought from previous month
      startDate: Date,                  // Package activation date
      endDate: Date,                    // Package expiry date
      status: {                         // 'active', 'expired', 'consumed', 'renewed'
        type: String,
        enum: ['active', 'expired', 'consumed', 'renewed'],
        default: 'active'
      },
      isCarryForward: { type: Boolean, default: false }, // Whether this is a carry-forward entry
      originalPackageId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' }, // For carry-forwards
      
      // Subscription tracking
      subscriptionType: { 
        type: String, 
        enum: ['one_time', 'monthly_subscription'],
        default: 'one_time'
      }, // Payment mode: one-time or recurring subscription
      subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentSubscription' } // Reference to subscription if applicable
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Broker', BrokerSchema);
