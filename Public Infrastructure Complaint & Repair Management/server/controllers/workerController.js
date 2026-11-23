import Complaint from '../models/Complaint.js';
import RepairUpdate from '../models/RepairUpdate.js';
import StatusHistory from '../models/StatusHistory.js';
import Notification from '../models/Notification.js';
import Assignment from '../models/Assignment.js';

export const getMyTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { assignedWorkerId: req.user._id };

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    const tasks = await Complaint.find(filter)
      .populate('citizenId', 'fullName phone address')
      .populate({
        path: 'categoryId',
        populate: { path: 'departmentId', select: 'name code' },
      })
      .populate('wardId')
      .sort({ submissionDate: -1 });

    const pendingCount = tasks.filter((t) => t.status === 'Assigned').length;
    const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
    const completedCount = tasks.filter((t) => ['Work Completed', 'Resolved'].includes(t.status)).length;

    res.json({
      success: true,
      count: tasks.length,
      metrics: {
        total: tasks.length,
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
      },
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskDetails = async (req, res) => {
  try {
    const task = await Complaint.findOne({
      _id: req.params.id,
      assignedWorkerId: req.user._id,
    })
      .populate('citizenId', 'fullName email phone address')
      .populate({
        path: 'categoryId',
        populate: { path: 'departmentId' },
      })
      .populate('wardId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you.',
      });
    }

    const [repairUpdates, statusHistory] = await Promise.all([
      RepairUpdate.find({ complaintId: task._id }).sort({ createdAt: -1 }),
      StatusHistory.find({ complaintId: task._id })
        .populate('changedByUserId', 'fullName role')
        .sort({ changedAt: 1 }),
    ]);

    res.json({
      success: true,
      task,
      repairUpdates,
      statusHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const task = await Complaint.findOne({
      _id: req.params.id,
      assignedWorkerId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you.',
      });
    }

    const allowedTransitions = ['In Progress', 'Work Completed'];
    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Field workers can only transition tasks to 'In Progress' or 'Work Completed'.`,
      });
    }

    const previousStatus = task.status;
    task.status = status;
    await task.save();

    await Assignment.findOneAndUpdate(
      { complaintId: task._id, workerId: req.user._id },
      { status: status === 'Work Completed' ? 'Completed' : 'In Progress' }
    );

    await StatusHistory.create({
      complaintId: task._id,
      previousStatus,
      newStatus: status,
      changedByUserId: req.user._id,
      remarks: remarks || `Field technician updated status to ${status}.`,
    });

    await Notification.create({
      userId: task.citizenId,
      complaintId: task._id,
      title: `Field Work: ${status}`,
      message: `Technician ${req.user.fullName} updated your repair order to '${status}'.`,
      notificationType: 'status_update',
    });

    res.json({
      success: true,
      message: `Work status transitioned to ${status}.`,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitRepairUpdate = async (req, res) => {
  try {
    const { updateNotes, materialsUsed, costIncurred, updateType } = req.body;
    const task = await Complaint.findOne({
      _id: req.params.id,
      assignedWorkerId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you.',
      });
    }

    if (!updateNotes) {
      return res.status(400).json({
        success: false,
        message: 'Repair notes and observations are required.',
      });
    }

    let beforeImageUrl = req.body.beforeImageUrl || '';
    let afterImageUrl = req.body.afterImageUrl || '';

    if (req.files) {
      if (req.files.beforeImage && req.files.beforeImage[0]) {
        beforeImageUrl = `/uploads/${req.files.beforeImage[0].filename}`;
      }
      if (req.files.afterImage && req.files.afterImage[0]) {
        afterImageUrl = `/uploads/${req.files.afterImage[0].filename}`;
      }
    }

    const repairUpdate = await RepairUpdate.create({
      complaintId: task._id,
      workerId: req.user._id,
      updateNotes,
      beforeImageUrl,
      afterImageUrl,
      materialsUsed: materialsUsed || '',
      costIncurred: costIncurred ? parseFloat(costIncurred) : 0,
      updateType: updateType || 'Progress Note',
    });

    // If updateType is 'Work Finished', auto-transition to 'Work Completed'
    if (updateType === 'Work Finished' && task.status !== 'Work Completed') {
      const prev = task.status;
      task.status = 'Work Completed';
      await task.save();

      await StatusHistory.create({
        complaintId: task._id,
        previousStatus: prev,
        newStatus: 'Work Completed',
        changedByUserId: req.user._id,
        remarks: `Technician submitted final completion report and photographs.`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Repair log and photographic proof recorded successfully.',
      repairUpdate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
