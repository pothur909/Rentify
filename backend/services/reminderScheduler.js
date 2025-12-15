const LeadReminder = require('../models/LeadReminder');
const Broker = require('../models/Broker');
const { sendPushNotification } = require('./notificationService');

let schedulerInterval = null;

/**
 * Check for due reminders and send notifications
 */
async function checkAndSendReminders() {
  try {
    const now = new Date();

    // Find all pending reminders that are due
    const dueReminders = await LeadReminder.find({
      status: 'pending',
      reminderTime: { $lte: now }
    })
      .populate('leadId', 'name phoneNumber address areaKey')
      .populate('brokerId', 'name fcmTokens');

    if (dueReminders.length === 0) {
      return;
    }

    console.log(`Found ${dueReminders.length} due reminders to process`);

    for (const reminder of dueReminders) {
      try {
        // Get broker's FCM tokens
        const broker = reminder.brokerId;
        if (!broker || !broker.fcmTokens || broker.fcmTokens.length === 0) {
          console.log(`Broker ${broker?._id} has no FCM tokens, skipping reminder ${reminder._id}`);
          
          // Mark as sent anyway to avoid retrying
          reminder.status = 'sent';
          reminder.sentAt = new Date();
          await reminder.save();
          continue;
        }

        // Prepare notification payload
        const lead = reminder.leadId;
        const title = `Reminder: ${lead?.name || 'Lead'}`;
        const body = reminder.message;

        const notificationData = {
          type: 'lead_reminder',
          leadId: lead?._id?.toString() || '',
          reminderId: reminder._id.toString(),
          leadName: lead?.name || '',
          leadAddress: lead?.address || '',
          leadAreaKey: lead?.areaKey || ''
        };

        // Send push notification to all broker's devices
        let sentCount = 0;
        for (const token of broker.fcmTokens) {
          try {
            await sendPushNotification(token, title, body, notificationData);
            sentCount++;
          } catch (error) {
            console.error(`Failed to send to token ${token}:`, error.message);
          }
        }

        console.log(`Sent reminder ${reminder._id} to ${sentCount}/${broker.fcmTokens.length} devices`);

        // Mark reminder as sent
        reminder.status = 'sent';
        reminder.sentAt = new Date();
        await reminder.save();

      } catch (error) {
        console.error(`Error processing reminder ${reminder._id}:`, error);
        // Continue with next reminder
      }
    }

    console.log(`Processed ${dueReminders.length} reminders`);
  } catch (error) {
    console.error('Error in checkAndSendReminders:', error);
  }
}

/**
 * Start the reminder scheduler
 * Checks for due reminders every minute
 */
function startReminderScheduler() {
  if (schedulerInterval) {
    console.log('Reminder scheduler is already running');
    return;
  }

  console.log('Starting reminder scheduler (checks every 1 minute)');

  // Run immediately on start
  checkAndSendReminders();

  // Then run every minute
  schedulerInterval = setInterval(() => {
    checkAndSendReminders();
  }, 60 * 1000); // 60 seconds = 1 minute

  console.log('Reminder scheduler started successfully');
}

/**
 * Stop the reminder scheduler
 */
function stopReminderScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('Reminder scheduler stopped');
  }
}

module.exports = {
  startReminderScheduler,
  stopReminderScheduler,
  checkAndSendReminders // Export for manual testing
};
