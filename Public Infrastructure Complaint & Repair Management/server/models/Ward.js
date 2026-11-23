import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  zone: {
    type: String,
    required: true,
    trim: true,
  },
  councillorName: {
    type: String,
    required: true,
  },
  councillorPhone: {
    type: String,
    required: true,
  },
  officeAddress: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    default: 0,
  },
  areaSqKm: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Ward', wardSchema);
