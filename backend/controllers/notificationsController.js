const { registerFCMToken, removeFCMToken } = require('../services/notificationService');
const { sendLeadAssignmentNotification } = require('../services/notificationService');
const Broker = require('../models/Broker');

/**
 * Register FCM token for a broker
 */
async function registerToken(req, res) {
  try {
    const { brokerId, fcmToken } = req.body;

    if (!brokerId || !fcmToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'brokerId and fcmToken are required' 
      });
    }

    await registerFCMToken(brokerId, fcmToken);

    res.json({ 
      success: true, 
      message: 'FCM token registered successfully' 
    });
  } catch (error) {
    console.error('Error in registerToken:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register FCM token',
      error: error.message 
    });
  }
}

/**
 * Remove FCM token for a broker (e.g., on logout)
 */
async function removeToken(req, res) {
  try {
    const { brokerId, fcmToken } = req.body;

    if (!brokerId || !fcmToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'brokerId and fcmToken are required' 
      });
    }

    await removeFCMToken(brokerId, fcmToken);

    res.json({ 
      success: true, 
      message: 'FCM token removed successfully' 
    });
  } catch (error) {
    console.error('Error in removeToken:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove FCM token',
      error: error.message 
    });
  }
}

/**
 * Test endpoint to send a notification to a broker
 * POST /api/notifications/test
 * Body: { brokerId: string }
 */
async function testNotification(req, res) {
  try {
    const { brokerId } = req.body;

    if (!brokerId) {
      return res.status(400).json({ 
        success: false, 
        message: 'brokerId is required' 
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

    // Check if broker has FCM tokens
    if (!broker.fcmTokens || broker.fcmTokens.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Broker has no registered FCM tokens. Please login to the dashboard first to register a token.' 
      });
    }

    // Create a mock lead data for testing
    const mockLeadData = {
      _id: 'test-lead-123',
      address: 'Test Address, Koramangala, Bangalore',
      propertyType: 'Apartment',
      budget: '25000',
      flatType: '2BHK',
      name: 'Test Customer',
      phoneNumber: '+91 9876543210'
    };

    // Send test notification
    await sendLeadAssignmentNotification(brokerId, mockLeadData);

    res.json({ 
      success: true, 
      message: 'Test notification sent successfully',
      data: {
        brokerName: broker.name,
        brokerId: broker._id,
        fcmTokensCount: broker.fcmTokens.length,
        mockLead: mockLeadData
      }
    });
  } catch (error) {
    console.error('Error in testNotification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test notification',
      error: error.message 
    });
  }
}

module.exports = {
  registerToken,
  removeToken,
  testNotification,
};
