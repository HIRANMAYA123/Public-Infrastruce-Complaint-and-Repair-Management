import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  locationAddress: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  imageUrl: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Work Completed', 'Resolved', 'Rejected', 'Reopened'],
    default: 'Pending',
  },
  assignedWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedAt: {
    type: Date,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  resolutionDeadline: {
    type: Date,
  },
  resolvedAt: {
    type: Date,
  },
  adminRemarks: {
    type: String,
  },
}, {
  timestamps: true,
});

complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ citizenId: 1 });
complaintSchema.index({ assignedWorkerId: 1 });
complaintSchema.index({ categoryId: 1 });
complaintSchema.index({ wardId: 1 });

export default mongoose.model('Complaint', complaintSchema);
