var express = require('express');
var router = express.Router();
const { signup, requestOtp, verifyOtp } = require('../controllers/brokersController');

// Signup new broker
router.post('/signup', signup);

// Login flow: request OTP then verify
router.post('/login/request-otp', requestOtp);
router.post('/login/verify', verifyOtp);

module.exports = router;
