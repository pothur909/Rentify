const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SubAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },
    allowedRoutes: { type: [String], default: [] },
    assignedLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
    assignedBrokers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Broker' }],
    isActive: { type: Boolean, default: true },
    role: { type: String, default: 'sub-admin', immutable: true },
  },
  { timestamps: true }
);

// Hash password before saving
SubAdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
SubAdminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Don't return password in JSON responses
SubAdminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('SubAdmin', SubAdminSchema);
