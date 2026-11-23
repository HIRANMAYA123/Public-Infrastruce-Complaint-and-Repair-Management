// ============================================================================
// CivicFix – Public Infrastructure Complaint & Repair Management System
// MongoDB Aggregation Pipeline Views
// Target: MongoDB 5.0+ / 6.0+ / 7.0+ / 9.0+
// ============================================================================

const db = db.getSiblingDB('civicfix');

// 1. View: complaint_overview
db.createView('complaint_overview', 'complaints', [
  {
    $lookup: {
      from: 'users',
      localField: 'citizenId',
      foreignField: '_id',
      as: 'citizen'
    }
  },
  { $unwind: { path: '$citizen', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'departments',
      localField: 'category.departmentId',
      foreignField: '_id',
      as: 'department'
    }
  },
  { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'wards',
      localField: 'wardId',
      foreignField: '_id',
      as: 'ward'
    }
  },
  { $unwind: { path: '$ward', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'assignedWorkerId',
      foreignField: '_id',
      as: 'assignedWorker'
    }
  },
  { $unwind: { path: '$assignedWorker', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'feedbacks',
      localField: '_id',
      foreignField: 'complaintId',
      as: 'feedback'
    }
  },
  { $unwind: { path: '$feedback', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      complaintCode: 1,
      title: 1,
      description: 1,
      locationAddress: 1,
      landmark: 1,
      priority: 1,
      status: 1,
      submissionDate: 1,
      resolutionDeadline: 1,
      resolvedAt: 1,
      adminRemarks: 1,
      'citizen.fullName': 1,
      'citizen.phone': 1,
      'citizen.email': 1,
      'category.name': 1,
      'category.defaultSlaHours': 1,
      'department.name': 1,
      'department.code': 1,
      'ward.wardNumber': 1,
      'ward.name': 1,
      'ward.zone': 1,
      'assignedWorker.fullName': 1,
      'assignedWorker.phone': 1,
      'assignedWorker.employeeCode': 1,
      'feedback.rating': 1,
      'feedback.satisfactionLevel': 1
    }
  }
]);

// 2. View: department_complaint_summary
db.createView('department_complaint_summary', 'departments', [
  {
    $lookup: {
      from: 'categories',
      localField: '_id',
      foreignField: 'departmentId',
      as: 'deptCategories'
    }
  },
  {
    $lookup: {
      from: 'complaints',
      localField: 'deptCategories._id',
      foreignField: 'categoryId',
      as: 'complaints'
    }
  },
  {
    $project: {
      departmentName: '$name',
      code: '$code',
      headName: '$headName',
      totalComplaints: { $size: '$complaints' },
      pendingCount: {
        $size: {
          $filter: {
            input: '$complaints',
            as: 'c',
            cond: { $eq: ['$$c.status', 'Pending'] }
          }
        }
      },
      inProgressCount: {
        $size: {
          $filter: {
            input: '$complaints',
            as: 'c',
            cond: { $in: ['$$c.status', ['Assigned', 'In Progress', 'Work Completed']] }
          }
        }
      },
      resolvedCount: {
        $size: {
          $filter: {
            input: '$complaints',
            as: 'c',
            cond: { $eq: ['$$c.status', 'Resolved'] }
          }
        }
      }
    }
  }
]);

// 3. View: worker_performance_summary
db.createView('worker_performance_summary', 'users', [
  { $match: { role: 'field_worker' } },
  {
    $lookup: {
      from: 'departments',
      localField: 'departmentId',
      foreignField: '_id',
      as: 'department'
    }
  },
  { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'assignments',
      localField: '_id',
      foreignField: 'workerId',
      as: 'assignments'
    }
  },
  {
    $project: {
      workerName: '$fullName',
      employeeCode: '$employeeCode',
      phone: '$phone',
      skillSpecialization: '$skillSpecialization',
      departmentName: '$department.name',
      ratingAvg: '$ratingAvg',
      totalAssignedTasks: { $size: '$assignments' },
      activeTasks: '$activeTasksCount',
      completedTasks: '$completedTasksCount'
    }
  }
]);

print(">>> MongoDB Aggregation Views Created Successfully.");
