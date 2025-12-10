const express = require('express');
const router = express.Router();
const {
  createReminder,
  getRemindersForBroker,
  getRemindersForLead,
  updateReminder,
  deleteReminder
} = require('../controllers/reminderController');

// Create a new reminder
router.post('/', createReminder);

// Get all reminders for a broker
router.get('/broker/:brokerId', getRemindersForBroker);

// Get all reminders for a specific lead
router.get('/lead/:leadId', getRemindersForLead);

// Update a reminder
router.put('/:id', updateReminder);

// Delete/cancel a reminder
router.delete('/:id', deleteReminder);

module.exports = router;
