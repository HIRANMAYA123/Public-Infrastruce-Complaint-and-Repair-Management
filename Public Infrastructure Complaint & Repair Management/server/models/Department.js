import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
  },
  headName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  helplineNumber: {
    type: String,
    required: true,
  },
  budgetAllocated: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Department', departmentSchema);
