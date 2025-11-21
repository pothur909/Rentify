const mongoose = require('mongoose');

const BrokerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    serviceAreas: { type: [String], default: [] },
    availableFlatTypes: { type: [String], default: [] },
    address: { type: String, trim: true },
    otpCode: { type: String },
    otpExpires: { type: Date },
    currentPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    packagePurchasedAt: { type: Date },
    leadsAssigned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Broker', BrokerSchema);
