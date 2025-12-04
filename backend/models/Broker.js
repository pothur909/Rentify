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

    otpCode: { type: String },
    otpExpires: { type: Date },
    paymentIds: {
      type: [String],
      default: [],
    },
    currentPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadPackage' },
    packagePurchasedAt: { type: Date },
    leadsAssigned: { type: Number, default: 0 },
    fcmTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Broker', BrokerSchema);
