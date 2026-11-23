import mongoose from 'mongoose';

const repairUpdateSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updateNotes: {
    type: String,
    required: true,
  },
  beforeImageUrl: {
    type: String,
  },
  afterImageUrl: {
    type: String,
  },
  materialsUsed: {
    type: String,
  },
  costIncurred: {
    type: Number,
    default: 0,
  },
  updateType: {
    type: String,
    enum: ['Progress Note', 'Inspection Completed', 'Repair In Progress', 'Work Finished'],
    default: 'Progress Note',
  },
}, {
  timestamps: true,
});

export default mongoose.model('RepairUpdate', repairUpdateSchema);
