// ============================================================================
// CivicFix – Public Infrastructure Complaint & Repair Management System
// Advanced MongoDB Query Catalog & Demonstration Operations
// ============================================================================

const db = db.getSiblingDB('civicfix');

// ----------------------------------------------------------------------------
// 1. Multi-Stage Aggregation Join ($lookup + $match + $project)
// Retrieves active high-priority complaints joined with citizen info,
// category details, ward, and assigned field specialist.
// ----------------------------------------------------------------------------
db.complaints.aggregate([
  {
    $match: {
      status: { $nin: ['Resolved', 'Rejected'] },
      priority: { $in: ['High', 'Urgent'] }
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'citizenId',
      foreignField: '_id',
      as: 'citizen'
    }
  },
  { $unwind: '$citizen' },
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },
  {
    $lookup: {
      from: 'wards',
      localField: 'wardId',
      foreignField: '_id',
      as: 'ward'
    }
  },
  { $unwind: '$ward' },
  {
    $lookup: {
      from: 'users',
      localField: 'assignedWorkerId',
      foreignField: '_id',
      as: 'worker'
    }
  },
  { $unwind: { path: '$worker', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      complaintCode: 1,
      title: 1,
      priority: 1,
      status: 1,
      locationAddress: 1,
      submissionDate: 1,
      citizenName: '$citizen.fullName',
      citizenContact: '$citizen.phone',
      categoryName: '$category.name',
      wardNumber: '$ward.wardNumber',
      wardZone: '$ward.zone',
      assignedSpecialist: '$worker.fullName'
    }
  },
  { $sort: { submissionDate: -1 } }
]);

// ----------------------------------------------------------------------------
// 2. Multi-Faceted Aggregation ($facet)
// Computes simultaneous operational insights in a single database pass:
// - Status breakdown counts
// - Priority distribution
// - SLA overdue counts
// ----------------------------------------------------------------------------
db.complaints.aggregate([
  {
    $facet: {
      statusDistribution: [
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ],
      priorityBreakdown: [
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ],
      overdueTickets: [
        {
          $match: {
            status: { $nin: ['Resolved', 'Rejected'] },
            resolutionDeadline: { $lt: new Date() }
          }
        },
        { $count: 'overdueTotal' }
      ]
    }
  }
]);

// ----------------------------------------------------------------------------
// 3. Average Resolution Speed by Category ($group + $avg)
// ----------------------------------------------------------------------------
db.complaints.aggregate([
  {
    $match: {
      status: 'Resolved',
      resolvedAt: { $ne: null }
    }
  },
  {
    $project: {
      categoryId: 1,
      durationHours: {
        $divide: [{ $subtract: ['$resolvedAt', '$submissionDate'] }, 3600000]
      }
    }
  },
  {
    $group: {
      _id: '$categoryId',
      avgResolutionHours: { $avg: '$durationHours' },
      resolvedCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: 'categories',
      localField: '_id',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },
  {
    $project: {
      categoryName: '$category.name',
      targetSlaHours: '$category.defaultSlaHours',
      actualAvgHours: { $round: ['$avgResolutionHours', 1] },
      resolvedCount: 1
    }
  },
  { $sort: { actualAvgHours: -1 } }
]);

// ----------------------------------------------------------------------------
// 4. Atomic Multi-Document Transaction Demonstration
// Atomically assigns complaint to field worker, updates caseload, and logs status
// ----------------------------------------------------------------------------
async function executeAtomicAssignment(session, complaintId, workerId, adminUserId, notes) {
  const complaintsColl = db.getCollection('complaints');
  const assignmentsColl = db.getCollection('assignments');
  const usersColl = db.getCollection('users');
  const historyColl = db.getCollection('statushistories');

  // Step 1: Update Complaint
  await complaintsColl.updateOne(
    { _id: complaintId },
    {
      $set: {
        status: 'Assigned',
        assignedWorkerId: workerId,
        assignedAt: new Date(),
        adminRemarks: notes
      }
    },
    { session }
  );

  // Step 2: Create Assignment record
  await assignmentsColl.insertOne(
    {
      complaintId,
      workerId,
      assignedByAdminId: adminUserId,
      status: 'Assigned',
      notes,
      assignedAt: new Date()
    },
    { session }
  );

  // Step 3: Increment Worker Caseload
  await usersColl.updateOne(
    { _id: workerId },
    { $inc: { activeTasksCount: 1 } },
    { session }
  );

  // Step 4: Audit trail
  await historyColl.insertOne(
    {
      complaintId,
      previousStatus: 'Pending',
      newStatus: 'Assigned',
      changedByUserId: adminUserId,
      remarks: notes,
      changedAt: new Date()
    },
    { session }
  );
}
