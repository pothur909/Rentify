const mongoose = require('mongoose');

const LeadReminderSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      required: true,
      index: true
    },
    reminderTime: {
      type: Date,
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'cancelled'],
      default: 'pending',
      index: true
    },
    sentAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Index for efficient querying of pending reminders
LeadReminderSchema.index({ status: 1, reminderTime: 1 });

module.exports = mongoose.model('LeadReminder', LeadReminderSchema);
