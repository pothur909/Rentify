const mongoose = require('mongoose');

const ContactHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        
        'call_completed',
        'not_answered',
        'switched_off',
        'invalid_or_wrong_number',
        'call_later_requested',
        'lead_converted',
        'lead_not_converted',
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
    status: { type: String, enum: ['open', 'assigned', 'closed','contacted', 'call_completed',
        'not_answered',
        'switched_off',
        'invalid_or_wrong_number',
        'call_later_requested',
        'lead_converted',
        'lead_not_converted',], default: 'open' },
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
