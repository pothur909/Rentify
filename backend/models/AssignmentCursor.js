const mongoose = require('mongoose');

const AssignmentCursorSchema = new mongoose.Schema(
  {
    areaKey: { type: String, required: true, unique: true, index: true },
    lastAssignedBroker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssignmentCursor', AssignmentCursorSchema);
