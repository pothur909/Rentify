var express = require('express');
var router = express.Router();
const { registerToken, removeToken, testNotification } = require('../controllers/notificationsController');

// Register FCM token for a broker
router.post('/register-token', registerToken);

// Remove FCM token for a broker (on logout)
router.delete('/remove-token', removeToken);

// Test notification endpoint (for Postman testing)
router.post('/test', testNotification);

module.exports = router;
