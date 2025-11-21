const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    leadLimit: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', PackageSchema);
