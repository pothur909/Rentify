const Broker = require('../models/Broker');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "secret";

exports.signup = async (req, res, next) => {
  try {
    const { name, phoneNumber, serviceAreas, availableFlatTypes, address } = req.body;
    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'name and phoneNumber are required' });
    }

    const existing = await Broker.findOne({ phoneNumber });
    if (existing) {
      return res.status(409).json({ message: 'Broker already exists with this phone number' });
    }

    const broker = await Broker.create({
      name,
      phoneNumber,
      serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? [serviceAreas] : []),
      availableFlatTypes: Array.isArray(availableFlatTypes) ? availableFlatTypes : (availableFlatTypes ? [availableFlatTypes] : []),
      address,
    });

    return res.status(201).json({ message: 'Broker signed up', data: broker });
  } catch (err) {
    next(err);
  }
};

exports.requestOtp = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'phoneNumber is required' });
    }

    const broker = await Broker.findOne({ phoneNumber });
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found. Please sign up first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    broker.otpCode = otp;
    broker.otpExpires = expires;
    await broker.save();

    console.log(`OTP for ${phoneNumber}: ${otp} (expires at ${expires.toISOString()})`);

    return res.json({ message: 'OTP sent (check server logs in this demo)' });
  } catch (err) {
    next(err);
  }
};

// exports.verifyOtp = async (req, res, next) => {
//   try {
//     const { phoneNumber, otp } = req.body;
//     if (!phoneNumber || !otp) {
//       return res.status(400).json({ message: 'phoneNumber and otp are required' });
//     }

//     const broker = await Broker.findOne({ phoneNumber });
//     if (!broker || !broker.otpCode || !broker.otpExpires) {
//       return res.status(400).json({ message: 'OTP not requested or invalid' });
//     }

//     if (broker.otpExpires < new Date()) {
//       return res.status(400).json({ message: 'OTP expired' });
//     }

//     if (broker.otpCode !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     // Clear OTP after successful verification
//     broker.otpCode = undefined;
//     broker.otpExpires = undefined;
//     await broker.save();

//     return res.json({ message: 'Login successful' });
//   } catch (err) {
//     next(err);
//   }
// };


// Request OTP for signup

 // replace with your secret

exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
    }

    // Ensure +91 prefix
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

    const broker = await Broker.findOne({ phoneNumber: formattedPhone });
    if (!broker || !broker.otpCode || !broker.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP not requested or invalid" });
    }

    if (broker.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (broker.otpCode !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Clear OTP
    broker.otpCode = undefined;
    broker.otpExpires = undefined;
    await broker.save();

    // Generate JWT
    const token = jwt.sign({ brokerId: broker._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      broker: {
        _id: broker._id,
        name: broker.name,
        phoneNumber: broker.phoneNumber,
        serviceAreas: broker.serviceAreas,
        availableFlatTypes: broker.availableFlatTypes,
        address: broker.address
      }
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
