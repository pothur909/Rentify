const LeadReminder = require('../models/LeadReminder');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');

/**
 * Create a new reminder for a lead
 * POST /api/reminders
 * Body: { leadId, brokerId, reminderTime, message }
 */
exports.createReminder = async (req, res, next) => {
  try {
    const { leadId, brokerId, reminderTime, message } = req.body;

    if (!leadId || !brokerId || !reminderTime || !message) {
      return res.status(400).json({
        success: false,
        message: 'leadId, brokerId, reminderTime, and message are required'
      });
    }

    // Verify lead exists
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Verify broker exists
    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found'
      });
    }

    // Verify lead is assigned to this broker
    if (!lead.assignedTo || lead.assignedTo.toString() !== brokerId) {
      return res.status(403).json({
        success: false,
        message: 'Lead is not assigned to this broker'
      });
    }

    // Validate reminder time is in the future
    const reminderDate = new Date(reminderTime);
    if (reminderDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reminder time must be in the future'
      });
    }

    // Create reminder
    const reminder = await LeadReminder.create({
      leadId,
      brokerId,
      reminderTime: reminderDate,
      message,
      status: 'pending'
    });

    await reminder.populate(['leadId', 'brokerId']);

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    next(error);
  }
};

/**
 * Get all reminders for a broker
 * GET /api/reminders/broker/:brokerId
 */
exports.getRemindersForBroker = async (req, res, next) => {
  try {
    const { brokerId } = req.params;
    const { status } = req.query; // Optional filter by status

    const query = { brokerId };
    if (status) {
      query.status = status;
    }

    const reminders = await LeadReminder.find(query)
      .populate('leadId', 'name phoneNumber address areaKey status')
      .sort({ reminderTime: 1 });

    res.json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error('Error fetching broker reminders:', error);
    next(error);
  }
};

/**
 * Get all reminders for a specific lead
 * GET /api/reminders/lead/:leadId
 */
exports.getRemindersForLead = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    const reminders = await LeadReminder.find({ leadId })
      .populate('brokerId', 'name phoneNumber')
      .sort({ reminderTime: 1 });

    res.json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error('Error fetching lead reminders:', error);
    next(error);
  }
};

/**
 * Update a reminder
 * PUT /api/reminders/:id
 * Body: { reminderTime?, message? }
 */
exports.updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reminderTime, message } = req.body;

    const reminder = await LeadReminder.findById(id);
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Can't update sent or cancelled reminders
    if (reminder.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${reminder.status} reminder`
      });
    }

    // Update fields if provided
    if (reminderTime) {
      const reminderDate = new Date(reminderTime);
      if (reminderDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Reminder time must be in the future'
        });
      }
      reminder.reminderTime = reminderDate;
    }

    if (message) {
      reminder.message = message;
    }

    await reminder.save();
    await reminder.populate(['leadId', 'brokerId']);

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    next(error);
  }
};

/**
 * Delete/cancel a reminder
 * DELETE /api/reminders/:id
 */
exports.deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reminder = await LeadReminder.findById(id);
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Can't delete sent reminders, but can cancel pending ones
    if (reminder.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sent reminder'
      });
    }

    // Mark as cancelled instead of deleting
    reminder.status = 'cancelled';
    await reminder.save();

    res.json({
      success: true,
      message: 'Reminder cancelled successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    next(error);
  }
};
