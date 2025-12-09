const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const { sendLeadAssignmentNotification } = require('../services/notificationService');

/**
 * Manually assign an open lead to a broker and send notification
 * POST /api/leads/manual-assign
 * Body: { leadId: string, brokerId: string }
 */
async function manualAssignLead(req, res) {
  try {
    const { leadId, brokerId } = req.body;

    if (!leadId || !brokerId) {
      return res.status(400).json({
        success: false,
        message: 'leadId and brokerId are required'
      });
    }

    // Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Find the broker
    const broker = await Broker.findById(brokerId).populate('currentPackage');
    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found'
      });
    }

    // Check if broker has a package
    if (!broker.currentPackage) {
      return res.status(400).json({
        success: false,
        message: 'Broker does not have an active package'
      });
    }

    // Check if broker has capacity
    const leadsAssigned = broker.leadsAssigned || 0;
    const leadsCount = broker.currentPackage.leadsCount || 0;
    
    if (leadsAssigned >= leadsCount) {
      return res.status(400).json({
        success: false,
        message: 'Broker has reached their lead limit'
      });
    }

    // Assign the lead
    lead.assignedTo = brokerId;
    lead.assignedAt = new Date();
    lead.status = 'assigned';
    await lead.save();

    // Increment broker's leadsAssigned counter
    await Broker.findByIdAndUpdate(brokerId, {
      $inc: { leadsAssigned: 1 }
    });

    // Send notification
    try {
      await sendLeadAssignmentNotification(brokerId, lead);
    } catch (notifError) {
      console.error('Failed to send notification:', notifError.message);
      // Continue even if notification fails
    }

    res.json({
      success: true,
      message: 'Lead assigned successfully and notification sent',
      data: {
        lead: {
          id: lead._id,
          address: lead.address,
          areaKey: lead.areaKey,
          status: lead.status,
          assignedTo: lead.assignedTo,
          assignedAt: lead.assignedAt
        },
        broker: {
          id: broker._id,
          name: broker.name,
          leadsAssigned: leadsAssigned + 1,
          leadsRemaining: leadsCount - (leadsAssigned + 1)
        }
      }
    });
  } catch (error) {
    console.error('Error in manualAssignLead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign lead',
      error: error.message
    });
  }
}

module.exports = {
  manualAssignLead
};
