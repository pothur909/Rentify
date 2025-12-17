const Lead = require('../models/Lead');
const Broker = require('../models/Broker');
const { sendLeadAssignmentNotification } = require('../services/notificationService');
const { getActivePackagesForBroker, findAvailablePackage, assignLeadToPackage } = require('../utils/packageExpiryHelper');

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
    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found'
      });
    }

    // Get all active packages for this broker (sorted by oldest first - FIFO)
    const activePackages = await getActivePackagesForBroker(brokerId);
    
    if (!activePackages || activePackages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Broker does not have any active packages'
      });
    }

    // Find first available package with remaining capacity
    const availablePackage = findAvailablePackage(activePackages);
    
    if (!availablePackage) {
      return res.status(400).json({
        success: false,
        message: 'Broker has reached their lead limit across all packages'
      });
    }

    // Assign the lead
    lead.assignedTo = brokerId;
    lead.assignedAt = new Date();
    lead.status = 'assigned';
    await lead.save();

    // Increment package's leadsAssigned counter and update status if needed
    const updatedPackage = await assignLeadToPackage(availablePackage._id, lead._id);

    // Update broker's packageHistory to keep it in sync
    const { updateBrokerPackageHistory } = require('../utils/packageExpiryHelper');
    const packageRefId = availablePackage.isFromPackageHistory 
      ? availablePackage._id  // Use packageHistory entry ID directly
      : availablePackage._id; // Use PaymentTransaction ID
    const packageId = availablePackage.packageId?._id || availablePackage.packageId;
    await updateBrokerPackageHistory(brokerId, packageRefId, packageId);

    // Increment broker's leadsAssigned counter (for backward compatibility)
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

    // Calculate remaining leads across all packages
    let totalRemaining = 0;
    for (const pkg of activePackages) {
      if (!pkg.packageId) continue;
      const leadsAssigned = pkg._id.toString() === updatedPackage._id.toString() 
        ? updatedPackage.leadsAssigned 
        : (pkg.leadsAssigned || 0);
      const leadsCount = pkg.packageId.leadsCount || 0;
      totalRemaining += Math.max(0, leadsCount - leadsAssigned);
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
          totalLeadsRemaining: totalRemaining
        },
        packageUsed: {
          id: updatedPackage._id,
          packageName: availablePackage.packageId?.name,
          leadsAssigned: updatedPackage.leadsAssigned,
          leadsCount: availablePackage.packageId?.leadsCount,
          status: updatedPackage.packageStatus,
          expiresAt: updatedPackage.expiresAt
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
