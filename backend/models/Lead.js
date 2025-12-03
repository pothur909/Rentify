const mongoose = require('mongoose');

const ContactHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'not_reachable',
        'not_received_call',
        'contacted',
        'pending_contacted_not_interested',
      ],
      required: true,
    },
    note: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
     contactHistory: {
      type: [ContactHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', LeadSchema);
