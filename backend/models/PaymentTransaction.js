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
  autoRenew: { type: Boolean, default: false }, // important
 mode: { type: String, enum: ["one_time", "subscription"], required: true,   index: true, },
subscriptionId: { type: String, index:true }, // Razorpay sub id
invoiceId: { type: String , index:true},      // Razorpay inv id
paymentId: { type: String , index: true},      // Razorpay pay_xxx
cycleNumber: { type: Number,  index: true},    // 1,2,3...

  },
  { timestamps: true }
);

PaymentTransactionSchema.index({ paymentId: 1 }, { unique: true, sparse: true });
PaymentTransactionSchema.index({ invoiceId: 1 }, { unique: true, sparse: true });

PaymentTransactionSchema.index({ brokerId: 1, createdAt: -1 });

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);
