import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  previousStatus: {
    type: String,
  },
  newStatus: {
    type: String,
    required: true,
  },
  changedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  remarks: {
    type: String,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('StatusHistory', statusHistorySchema);
