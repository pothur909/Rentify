const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSubscriptionSchema = new Schema(
  {
    brokerId: {
      type: Schema.Types.ObjectId,
      ref: 'Broker',
      required: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'LeadPackage',
      required: true,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'created',
        'pending',
        'active',
        'halted',
        'completed',
        'cancelled',
        'expired',
      ],
      default: 'created',
    },
    totalCount: { type: Number },
    remainingCount: { type: Number },
    currentCycleStart: { type: Date },
    currentCycleEnd: { type: Date },

    notes: { type: Schema.Types.Mixed },
    rawRazorpayObject: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentSubscription', PaymentSubscriptionSchema);
