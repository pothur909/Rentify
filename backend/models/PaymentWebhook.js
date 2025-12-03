const mongoose = require('mongoose');

const WebhookLogSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      index: true,
    },
    paymentId: {
      type: String,
      index: true,
    },

    rawPayload: {
      type: Object,
      required: true,
    },
    headers: {
      type: Object,
      required: true,
    },

    signatureVerified: {
      type: Boolean,
      default: false,
    },
    responseStatusCode: {
      type: Number,
      default: 200,
    },
    processingMessage: {
      type: String,
    },

    error: {
      message: String,
      stack: String,
      code: String,
    },
  },
  { timestamps: true }
);

WebhookLogSchema.index({ createdAt: -1 });

WebhookLogSchema.statics.getRecentLogs = function (limit = 100) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

WebhookLogSchema.statics.getLogsByOrderId = function (orderId) {
  return this.find({ orderId }).sort({ createdAt: -1 });
};

WebhookLogSchema.statics.getFailedLogs = function (limit = 100) {
  return this.find({
    $or: [
      { signatureVerified: false },
      { responseStatusCode: { $gte: 400 } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('PaymentWebhookLog', WebhookLogSchema);
