const mongoose = require('mongoose');

const PaymentTransactionSchema = new mongoose.Schema(
  {
    // who is paying
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      required: true,
      index: true,
    },

    // which package
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeadPackage',
      required: true,
      index: true,
    },

    // money
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },

    // razorpay order id
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
      index: true,
    },

    paidAt: {
      type: Date,
    },

    // Package expiry and usage tracking
    expiresAt: {
      type: Date,
    },
    leadsAssigned: {
      type: Number,
      default: 0,
    },
    packageStatus: {
      type: String,
      enum: ['paid', 'expired', 'consumed'],
      default: 'paid',
      index: true,
    },

    // raw data from Razorpay
    razorpayOrder: {
      type: Object,
    },
    razorpayEvents: {
      type: [Object],
      default: [],
    },

    webhookSignatureVerified: {
      type: Boolean,
      default: false,
    },
    webhookLastEvent: {
      type: String,
    },
  },
  { timestamps: true }
);

PaymentTransactionSchema.index({ brokerId: 1, createdAt: -1 });

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);
