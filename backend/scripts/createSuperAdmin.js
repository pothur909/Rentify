require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Make sure the path is correct from this script location
const SubAdmin = require('../models/SubAdmin');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env');
      process.exit(1);
    }

    console.log('Connecting to Mongo...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'admin@rentify.com'; // change as you like

    const existing = await SubAdmin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log('Super admin already exists with this email:', email);
      console.log('Id:', existing._id.toString());
      await mongoose.disconnect();
      return;
    }

    const superAdmin = await SubAdmin.create({
      name: 'Super Admin',
      email: email.toLowerCase(),
      password: 'admin', // change this before running in prod
      phoneNumber: '+910000000000',
      allowedRoutes: [
        '/dashboard',
        '/leads',
        '/brokers',
        '/packages',
        '/payments',
        '/sub-admins',
      ],
      role: 'super-admin',   // this will override default 'sub-admin'
      isActive: true,
    });

    console.log('Super admin created successfully');
    console.log('Email:', superAdmin.email);
    console.log('Use this password to login:', 'SuperStrongPass@123');
    console.log('Id:', superAdmin._id.toString());

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error while creating super admin:', err);
    process.exit(1);
  }
}

run();
