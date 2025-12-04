const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    address: { type: String, required: false, trim: true },
    budget: { type: Number, required: false },
    propertyType: { type: String, trim: true }, 
    flatType: { type: String, required: false, trim: true },
    furnishingType: { type: String, trim: true },   // Fully / Semi / Unfurnished
    amenities: { type: [String], default: [] },  
    status: { type: String, enum: ['open', 'assigned', 'closed','contacted'], default: 'open' },
    areaKey: { type: String, trim: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },
    assignedAt: { type: Date },
    remark: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', LeadSchema);
