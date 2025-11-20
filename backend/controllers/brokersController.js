const Broker = require('../models/Broker');

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

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'phoneNumber and otp are required' });
    }

    const broker = await Broker.findOne({ phoneNumber });
    if (!broker || !broker.otpCode || !broker.otpExpires) {
      return res.status(400).json({ message: 'OTP not requested or invalid' });
    }

    if (broker.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (broker.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    broker.otpCode = undefined;
    broker.otpExpires = undefined;
    await broker.save();

    return res.json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};
