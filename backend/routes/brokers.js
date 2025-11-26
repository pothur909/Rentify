var express = require('express');
var router = express.Router();
const { signup, requestOtp, verifyOtp, getAssignedLeads, purchasePackage, getAllBrokersForAdmin } = require('../controllers/brokersController');

// Admin route to get all brokers
router.get('/admin/all', getAllBrokersForAdmin);

// Signup new broker
router.post('/signup', signup);

// Login flow: request OTP then verify
router.post('/login/request-otp', requestOtp);
router.post('/login/verify', verifyOtp);

// Purchase package
router.post('/:brokerId/purchase-package', purchasePackage);

// Get assigned leads for a broker
router.get('/:brokerId/assigned-leads', getAssignedLeads);

module.exports = router;

