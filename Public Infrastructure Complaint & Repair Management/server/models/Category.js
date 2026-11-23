import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  defaultSlaHours: {
    type: Number,
    required: true,
    default: 48,
  },
  severityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  description: {
    type: String,
  },
  iconName: {
    type: String,
    default: 'AlertCircle',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Category', categorySchema);
