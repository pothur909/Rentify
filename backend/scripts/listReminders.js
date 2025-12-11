/**
 * Script to list all reminders in the database
 * Run with: node scripts/listReminders.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const LeadReminder = require('../models/LeadReminder');
const Lead = require('../models/Lead');
const Broker = require('../models/Broker');

async function listReminders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const reminders = await LeadReminder.find({})
      .populate('leadId', 'name address')
      .populate('brokerId', 'name')
      .sort({ reminderTime: 1 });

    if (reminders.length === 0) {
      console.log('📭 No reminders found in database');
      process.exit(0);
    }

    console.log(`📬 Found ${reminders.length} reminder(s):\n`);

    const now = new Date();
    
    reminders.forEach((reminder, index) => {
      const isPast = new Date(reminder.reminderTime) <= now;
      const timeStatus = isPast ? '⏰ DUE' : '⏳ SCHEDULED';
      
      console.log(`${index + 1}. ${timeStatus}`);
      console.log(`   ID: ${reminder._id}`);
      console.log(`   Lead: ${reminder.leadId?.name || 'Unknown'}`);
      console.log(`   Broker: ${reminder.brokerId?.name || 'Unknown'}`);
      console.log(`   Time: ${reminder.reminderTime.toLocaleString()}`);
      console.log(`   Status: ${reminder.status}`);
      console.log(`   Message: ${reminder.message.substring(0, 50)}${reminder.message.length > 50 ? '...' : ''}`);
      if (reminder.sentAt) {
        console.log(`   Sent At: ${reminder.sentAt.toLocaleString()}`);
      }
      console.log('');
    });

    const pending = reminders.filter(r => r.status === 'pending').length;
    const sent = reminders.filter(r => r.status === 'sent').length;
    const cancelled = reminders.filter(r => r.status === 'cancelled').length;
    const due = reminders.filter(r => r.status === 'pending' && new Date(r.reminderTime) <= now).length;

    console.log('📊 Summary:');
    console.log(`   Pending: ${pending}`);
    console.log(`   Sent: ${sent}`);
    console.log(`   Cancelled: ${cancelled}`);
    console.log(`   Due Now: ${due}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listReminders();
