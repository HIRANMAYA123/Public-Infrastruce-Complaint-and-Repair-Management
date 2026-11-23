// ============================================================================
// CivicFix – Public Infrastructure Complaint & Repair Management System
// MongoDB Database Initialization Script
// Target: MongoDB 5.0+ / 6.0+ / 7.0+ / 9.0+
// Run with: mongosh "mongodb://127.0.0.1:27017/civicfix" mongo-init.js
// ============================================================================

const db = db.getSiblingDB('civicfix');

print(">>> Initializing CivicFix MongoDB Database Schema & Collections...");

// 1. Create Collections with $jsonSchema Validation

// Departments Collection
db.createCollection('departments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'code', 'headName', 'contactEmail', 'helplineNumber'],
      properties: {
        name: { bsonType: 'string', description: 'Department Name' },
        code: { bsonType: 'string', description: 'Unique Department Code' },
        headName: { bsonType: 'string' },
        contactEmail: { bsonType: 'string', pattern: '^.+@.+\\..+$' },
        helplineNumber: { bsonType: 'string' },
        budgetAllocated: { bsonType: ['double', 'int', 'long', 'decimal'] },
        isActive: { bsonType: 'bool' }
      }
    }
  }
});
db.departments.createIndex({ code: 1 }, { unique: true });
db.departments.createIndex({ name: 1 }, { unique: true });

// Wards Collection
db.createCollection('wards', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['wardNumber', 'name', 'zone', 'councillorName', 'councillorPhone'],
      properties: {
        wardNumber: { bsonType: 'int', description: 'Ward number' },
        name: { bsonType: 'string' },
        zone: { bsonType: 'string' },
        councillorName: { bsonType: 'string' },
        councillorPhone: { bsonType: 'string' },
        population: { bsonType: ['int', 'long'] },
        areaSqKm: { bsonType: ['double', 'decimal', 'int'] }
      }
    }
  }
});
db.wards.createIndex({ wardNumber: 1 }, { unique: true });
db.wards.createIndex({ zone: 1 });

// Users Collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role', 'fullName'],
      properties: {
        email: { bsonType: 'string', pattern: '^.+@.+\\..+$' },
        password: { bsonType: 'string' },
        role: { enum: ['citizen', 'admin', 'field_worker'] },
        fullName: { bsonType: 'string' },
        phone: { bsonType: 'string' },
        wardId: { bsonType: ['objectId', 'null'] },
        departmentId: { bsonType: ['objectId', 'null'] },
        employeeCode: { bsonType: 'string' },
        ratingAvg: { bsonType: ['double', 'decimal', 'int'] },
        isActive: { bsonType: 'bool' }
      }
    }
  }
});
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ employeeCode: 1 }, { sparse: true });

// Categories Collection
db.createCollection('categories', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'departmentId', 'defaultSlaHours'],
      properties: {
        name: { bsonType: 'string' },
        departmentId: { bsonType: 'objectId' },
        defaultSlaHours: { bsonType: 'int' },
        severityLevel: { enum: ['Low', 'Medium', 'High', 'Urgent'] }
      }
    }
  }
});
db.categories.createIndex({ name: 1 }, { unique: true });
db.categories.createIndex({ departmentId: 1 });

// Complaints Collection
db.createCollection('complaints', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['complaintCode', 'citizenId', 'categoryId', 'wardId', 'title', 'description', 'locationAddress'],
      properties: {
        complaintCode: { bsonType: 'string' },
        citizenId: { bsonType: 'objectId' },
        categoryId: { bsonType: 'objectId' },
        wardId: { bsonType: 'objectId' },
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        locationAddress: { bsonType: 'string' },
        priority: { enum: ['Low', 'Medium', 'High', 'Urgent'] },
        status: { enum: ['Pending', 'Assigned', 'In Progress', 'Work Completed', 'Resolved', 'Rejected', 'Reopened'] },
        assignedWorkerId: { bsonType: ['objectId', 'null'] },
        submissionDate: { bsonType: 'date' },
        resolutionDeadline: { bsonType: 'date' },
        resolvedAt: { bsonType: ['date', 'null'] }
      }
    }
  }
});
db.complaints.createIndex({ complaintCode: 1 }, { unique: true });
db.complaints.createIndex({ status: 1, priority: 1 });
db.complaints.createIndex({ citizenId: 1 });
db.complaints.createIndex({ assignedWorkerId: 1 });
db.complaints.createIndex({ categoryId: 1 });
db.complaints.createIndex({ wardId: 1 });
db.complaints.createIndex({ submissionDate: -1 });

// Assignments Collection
db.createCollection('assignments');
db.assignments.createIndex({ complaintId: 1 });
db.assignments.createIndex({ workerId: 1 });

// StatusHistory Collection (Audit Trail)
db.createCollection('statushistories');
db.statushistories.createIndex({ complaintId: 1, changedAt: 1 });

// RepairUpdates Collection (Field Execution Proofs)
db.createCollection('repairupdates');
db.repairupdates.createIndex({ complaintId: 1 });
db.repairupdates.createIndex({ workerId: 1 });

// Feedback Collection
db.createCollection('feedbacks');
db.feedbacks.createIndex({ complaintId: 1 }, { unique: true });
db.feedbacks.createIndex({ rating: 1 });

// Notifications Collection
db.createCollection('notifications');
db.notifications.createIndex({ userId: 1, isRead: 1 });

print(">>> MongoDB Collections and Indexes Initialized Successfully.");
