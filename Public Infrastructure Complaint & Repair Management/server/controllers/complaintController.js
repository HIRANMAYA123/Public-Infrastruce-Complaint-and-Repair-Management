import Complaint from '../models/Complaint.js';
import Category from '../models/Category.js';
import StatusHistory from '../models/StatusHistory.js';
import Assignment from '../models/Assignment.js';
import RepairUpdate from '../models/RepairUpdate.js';
import Feedback from '../models/Feedback.js';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const generateComplaintCode = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `CF-${year}-${randomNum}`;
};

export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      wardId,
      locationAddress,
      landmark,
      latitude,
      longitude,
      priority,
    } = req.body;

    if (!title || !description || !categoryId || !wardId || !locationAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, ward, and location address.',
      });
    }

    // Validate categoryId format
    if (!categoryId || !require('mongoose').Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID provided.',
      });
    }
    const category = await Category.findById(categoryId);
    const slaHours = category?.defaultSlaHours || 48;
    const deadline = new Date(Date.now() + slaHours * 3600 * 1000);

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const complaint = await Complaint.create({
      complaintCode: generateComplaintCode(),
      citizenId: req.user._id,
      categoryId,
      wardId,
      title,
      description,
      locationAddress,
      landmark: landmark || '',
      coordinates: {
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      },
      imageUrl,
      priority: priority || category?.severityLevel || 'Medium',
      status: 'Pending',
      submissionDate: new Date(),
      resolutionDeadline: deadline,
    });

    // Audit initial status in StatusHistory
    await StatusHistory.create({
      complaintId: complaint._id,
      previousStatus: null,
      newStatus: 'Pending',
      changedByUserId: req.user._id,
      remarks: 'Complaint registered by citizen.',
    });

    // Notify citizen
    await Notification.create({
      userId: req.user._id,
      complaintId: complaint._id,
      title: 'Complaint Registered',
      message: `Your complaint #${complaint.complaintCode} has been logged and assigned an estimated ${slaHours}h resolution SLA.`,
      notificationType: 'complaint_registered',
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('categoryId')
      .populate('wardId');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating complaint.',
    });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = { citizenId: req.user._id };

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    if (category && category !== 'all') {
      filter.categoryId = category;
    }
    if (search) {
      filter.$or = [
        { complaintCode: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { locationAddress: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate({
        path: 'categoryId',
        populate: { path: 'departmentId', select: 'name code' },
      })
      .populate('wardId')
      .populate('assignedWorkerId', 'fullName phone ratingAvg')
      .sort({ submissionDate: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizenId', 'fullName email phone address')
      .populate({
        path: 'categoryId',
        populate: { path: 'departmentId' },
      })
      .populate('wardId')
      .populate('assignedWorkerId', 'fullName employeeCode phone skillSpecialization ratingAvg');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Role check: citizen can only view their own complaint, admin/workers have respective rights
    if (req.user.role === 'citizen' && complaint.citizenId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this complaint.',
      });
    }

    const [statusHistory, assignments, repairUpdates, feedback] = await Promise.all([
      StatusHistory.find({ complaintId: complaint._id })
        .populate('changedByUserId', 'fullName role')
        .sort({ changedAt: 1 }),
      Assignment.find({ complaintId: complaint._id })
        .populate('workerId', 'fullName employeeCode phone')
        .populate('assignedByAdminId', 'fullName designation')
        .sort({ assignedAt: -1 }),
      RepairUpdate.find({ complaintId: complaint._id })
        .populate('workerId', 'fullName employeeCode phone')
        .sort({ createdAt: -1 }),
      Feedback.findOne({ complaintId: complaint._id }),
    ]);

    res.json({
      success: true,
      complaint,
      statusHistory,
      assignments,
      repairUpdates,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.citizenId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Complaints can only be edited while in Pending triage status.',
      });
    }

    const { title, description, locationAddress, landmark, priority } = req.body;
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (locationAddress) complaint.locationAddress = locationAddress;
    if (landmark !== undefined) complaint.landmark = landmark;
    if (priority) complaint.priority = priority;

    if (req.file) {
      complaint.imageUrl = `/uploads/${req.file.filename}`;
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const withdrawComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.citizenId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending complaints can be withdrawn.',
      });
    }

    const previousStatus = complaint.status;
    complaint.status = 'Rejected';
    complaint.adminRemarks = 'Withdrawn voluntarily by citizen.';
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      previousStatus,
      newStatus: 'Rejected',
      changedByUserId: req.user._id,
      remarks: 'Withdrawn voluntarily by citizen.',
    });

    res.json({
      success: true,
      message: 'Complaint withdrawn successfully.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reopenComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.citizenId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Only resolved complaints can be reopened.',
      });
    }

    const { reason } = req.body;
    const previousStatus = complaint.status;
    complaint.status = 'Reopened';
    complaint.resolvedAt = null;
    complaint.adminRemarks = `Reopened by citizen: ${reason || 'Issue persists.'}`;
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      previousStatus,
      newStatus: 'Reopened',
      changedByUserId: req.user._id,
      remarks: `Citizen reopened complaint: ${reason || 'Issue persists.'}`,
    });

    res.json({
      success: true,
      message: 'Complaint reopened for administrative review.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { complaintId, rating, satisfactionLevel, comments } = req.body;

    if (!complaintId || !rating || !satisfactionLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complaintId, rating (1-5), and satisfactionLevel.',
      });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.citizenId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved complaints.',
      });
    }

    const existingFeedback = await Feedback.findOne({ complaintId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this complaint.',
      });
    }

    const feedback = await Feedback.create({
      complaintId,
      citizenId: req.user._id,
      rating: Number(rating),
      satisfactionLevel,
      comments,
    });

    // Recompute worker rating if worker was assigned
    if (complaint.assignedWorkerId) {
      const workerFeedbacks = await Feedback.aggregate([
        {
          $lookup: {
            from: 'complaints',
            localField: 'complaintId',
            foreignField: '_id',
            as: 'complaint',
          },
        },
        { $unwind: '$complaint' },
        {
          $match: {
            'complaint.assignedWorkerId': complaint.assignedWorkerId,
          },
        },
        {
          $group: {
            _id: '$complaint.assignedWorkerId',
            avgRating: { $avg: '$rating' },
          },
        },
      ]);

      if (workerFeedbacks.length > 0) {
        await User.findByIdAndUpdate(complaint.assignedWorkerId, {
          ratingAvg: Math.round(workerFeedbacks[0].avgRating * 100) / 100,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
