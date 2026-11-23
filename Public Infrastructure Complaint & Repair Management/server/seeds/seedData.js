import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Ward from '../models/Ward.js';
import Category from '../models/Category.js';
import Complaint from '../models/Complaint.js';
import Assignment from '../models/Assignment.js';
import StatusHistory from '../models/StatusHistory.js';
import RepairUpdate from '../models/RepairUpdate.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    // Seed categories if none exist, after departments are created
    // Helper to create default infrastructure categories (avoid duplicates)
    const ensureCategories = async (departments) => {
      const catCount = await Category.countDocuments();
      if (catCount > 0) return;
      const defaultCategories = [
        { name: 'Roads & Potholes', departmentId: departments[0]?._id },
        { name: 'Street Lights', departmentId: departments[2]?._id },
        { name: 'Water Supply', departmentId: departments[1]?._id },
        { name: 'Drainage & Sewage', departmentId: departments[4]?._id },
        { name: 'Garbage Management', departmentId: departments[3]?._id },
        { name: 'Footpaths & Sidewalks', departmentId: departments[0]?._id },
        { name: 'Public Parks', departmentId: departments[5]?._id },
        { name: 'Traffic Signals', departmentId: departments[0]?._id },
      ];
      await Category.create(defaultCategories);
      console.log('[CivicFix] Seeded default infrastructure categories');
    };

    if (existingUsers > 0) {
      console.log('[CivicFix] Database already contains data. Skipping full initial seed.');
      return;
    }

    console.log('[CivicFix] Seeding initial municipal dataset into MongoDB...');

    // 1. Departments
    const departments = await Department.create([
      {
        name: 'Roads & Bridges Department',
        code: 'DEPT-ROADS',
        description: 'Maintenance of city arterial roads, pedestrian sidewalks, flyovers, and asphalt surfacing.',
        headName: 'Dr. Rajesh Deshmukh',
        contactEmail: 'roads.dept@civicfix.gov.in',
        helplineNumber: '1800-202-0101',
        budgetAllocated: 45000000,
      },
      {
        name: 'Water Supply & Sewerage Board',
        code: 'DEPT-WATER',
        description: 'Potable municipal water distribution, pipeline leak repairs, and sewerage management.',
        headName: 'Er. Meenakshi Sundaram',
        contactEmail: 'water.dept@civicfix.gov.in',
        helplineNumber: '1800-202-0102',
        budgetAllocated: 38000000,
      },
      {
        name: 'Public Lighting & Electrical',
        code: 'DEPT-ELEC',
        description: 'High-mast illumination, smart LED streetlights, and transformer safety.',
        headName: 'Vikramaditya Rao',
        contactEmail: 'electrical.dept@civicfix.gov.in',
        helplineNumber: '1800-202-0103',
        budgetAllocated: 22000000,
      },
      {
        name: 'Solid Waste Management',
        code: 'DEPT-WASTE',
        description: 'Door-to-door sanitation, civic bin clearance, and landfill logistics.',
        headName: 'Dr. Ananya Sen',
        contactEmail: 'waste.dept@civicfix.gov.in',
        helplineNumber: '1800-202-0104',
        budgetAllocated: 31000000,
      },
      {
        name: 'Stormwater Drainage & Flood Control',
        code: 'DEPT-DRAIN',
        description: 'Culvert desilting, storm runoff drains, and monsoon flood abatement.',
        headName: 'Santosh Kulkarni',
        contactEmail: 'drainage.dept@civicfix.gov.in',
        helplineNumber: '1800-202-0105',
        budgetAllocated: 27000000,
      },
      {
        name: 'Parks & Public Amenities',
        code: 'DEPT-PARKS',
        description: 'Community parks, public benches, open gym equipment, and civic monuments.',
        headName: 'Sunita Sharma',
        contactEmail: 'parks.dept@civicfix.gov.in',
        helplineNumber: '1800-202-0106',
        budgetAllocated: 15000000,
      },
    ]);

    // 2. Wards
    const wards = await Ward.create([
      {
        wardNumber: 101,
        name: 'Ward 101 - Central Promenade',
        zone: 'Central Zone',
        councillorName: 'Shri Arvind Hegde',
        councillorPhone: '+91 98450 11201',
        officeAddress: 'Civic Centre, Mahatma Gandhi Road, Central',
        population: 45000,
        areaSqKm: 3.8,
      },
      {
        wardNumber: 102,
        name: 'Ward 102 - North Suburbs & Tech Park',
        zone: 'North Zone',
        councillorName: 'Smt. Kavitha Pillai',
        councillorPhone: '+91 98450 11202',
        officeAddress: 'Sub-City Complex, Outer Ring Road, North',
        population: 68000,
        areaSqKm: 7.2,
      },
      {
        wardNumber: 103,
        name: 'Ward 103 - Heritage Old Town',
        zone: 'South Zone',
        councillorName: 'Shri Rameshwar Bhat',
        councillorPhone: '+91 98450 11203',
        officeAddress: 'Town Hall Annexe, Fort Area, South',
        population: 52000,
        areaSqKm: 4.1,
      },
      {
        wardNumber: 104,
        name: 'Ward 104 - Riverside West',
        zone: 'West Zone',
        councillorName: 'Smt. Deepa Nair',
        councillorPhone: '+91 98450 11204',
        officeAddress: 'West Ghat Colony, Riverside Boulevard',
        population: 39000,
        areaSqKm: 5.4,
      },
      {
        wardNumber: 105,
        name: 'Ward 105 - Greenfield Industrial Zone',
        zone: 'East Zone',
        councillorName: 'Shri Mahendra Patil',
        councillorPhone: '+91 98450 11205',
        officeAddress: 'Sector 9 Industrial Hub, Greenfield',
        population: 31000,
        areaSqKm: 8.5,
      },
    ]);

    // 3. Categories
    const categories = await Category.create([
      {
        name: 'Road Damage & Potholes',
        departmentId: departments[0]._id,
        defaultSlaHours: 48,
        severityLevel: 'High',
        description: 'Dangerous potholes, road cave-ins, broken medians, asphalt erosion.',
        iconName: 'Construction',
      },
      {
        name: 'Water Supply & Leakage',
        departmentId: departments[1]._id,
        defaultSlaHours: 24,
        severityLevel: 'Urgent',
        description: 'Underground main line bursts, contaminated drinking water, no supply.',
        iconName: 'Droplets',
      },
      {
        name: 'Broken Streetlights',
        departmentId: departments[2]._id,
        defaultSlaHours: 36,
        severityLevel: 'Medium',
        description: 'Flickering or unlit street lamps, broken glass, hanging live cables.',
        iconName: 'Lightbulb',
      },
      {
        name: 'Clogged Drainage & Flooding',
        departmentId: departments[4]._id,
        defaultSlaHours: 24,
        severityLevel: 'Urgent',
        description: 'Blocked stormwater culverts, road waterlogging, open sewer manholes.',
        iconName: 'Waves',
      },
      {
        name: 'Garbage & Waste Accumulation',
        departmentId: departments[3]._id,
        defaultSlaHours: 24,
        severityLevel: 'High',
        description: 'Overflowing public bins, illegal dumping on roadsides, bio-waste.',
        iconName: 'Trash2',
      },
      {
        name: 'Public Property & Amenities',
        departmentId: departments[5]._id,
        defaultSlaHours: 72,
        severityLevel: 'Low',
        description: 'Damaged park benches, broken gym equipment, vandalized signages.',
        iconName: 'ShieldAlert',
      },
      {
        name: 'Electrical & Transformer Hazard',
        departmentId: departments[2]._id,
        defaultSlaHours: 12,
        severityLevel: 'Urgent',
        description: 'Sparks from transformer units, dangerously sagging high tension wires.',
        iconName: 'Zap',
      },
      {
        name: 'Other Infrastructure Issues',
        departmentId: departments[0]._id,
        defaultSlaHours: 48,
        severityLevel: 'Medium',
        description: 'Miscellaneous civic infrastructure defects requiring inspection.',
        iconName: 'HelpCircle',
      },
    ]);

    // 4. Users (Password: "Password123!")
    // Note: User.pre('save') hashes password automatically on User.create / new User
    const adminUser = await User.create({
      email: 'admin@civicfix.gov.in',
      password: 'Password123!',
      role: 'admin',
      fullName: 'Chief Municipal Administrator Roy',
      employeeCode: 'ADM-MC-001',
      designation: 'Chief Municipal Commissioner',
      departmentId: departments[0]._id,
      phone: '+91 94480 99001',
      address: 'Municipal Corporation HQ, Central Promenade',
      isActive: true,
    });

    const citizenUser1 = await User.create({
      email: 'citizen@civicfix.org',
      password: 'Password123!',
      role: 'citizen',
      fullName: 'Aarav Patel',
      phone: '+91 98765 43210',
      address: 'Flat 402, Shanti Heights, MG Road',
      wardId: wards[0]._id,
      isActive: true,
    });

    const citizenUser2 = await User.create({
      email: 'priya.sharma@example.com',
      password: 'Password123!',
      role: 'citizen',
      fullName: 'Priya Sharma',
      phone: '+91 97654 32109',
      address: '12B Palm Grove, Tech Park Avenue',
      wardId: wards[1]._id,
      isActive: true,
    });

    const workerUser1 = await User.create({
      email: 'worker@civicfix.gov.in',
      password: 'Password123!',
      role: 'field_worker',
      fullName: 'Ramesh Kumar',
      employeeCode: 'FW-RDS-101',
      departmentId: departments[0]._id,
      phone: '+91 91234 56780',
      skillSpecialization: 'Asphalt repair, pothole filling, heavy road roller operations',
      activeTasksCount: 1,
      completedTasksCount: 14,
      ratingAvg: 4.8,
      isAvailable: true,
      isActive: true,
    });

    const workerUser2 = await User.create({
      email: 'manoj.water@civicfix.gov.in',
      password: 'Password123!',
      role: 'field_worker',
      fullName: 'Manoj Gowda',
      employeeCode: 'FW-WTR-201',
      departmentId: departments[1]._id,
      phone: '+91 91234 56782',
      skillSpecialization: 'Pressurized main leak plugging, valve overhauls',
      activeTasksCount: 1,
      completedTasksCount: 22,
      ratingAvg: 4.9,
      isAvailable: true,
      isActive: true,
    });

    const workerUser3 = await User.create({
      email: 'suresh.elec@civicfix.gov.in',
      password: 'Password123!',
      role: 'field_worker',
      fullName: 'Suresh Reddy',
      employeeCode: 'FW-ELC-301',
      departmentId: departments[2]._id,
      phone: '+91 91234 56783',
      skillSpecialization: 'High-mast LED pole troubleshooting, wiring shorts',
      activeTasksCount: 0,
      completedTasksCount: 18,
      ratingAvg: 4.75,
      isAvailable: true,
      isActive: true,
    });

    // 5. Complaints
    const complaint1 = await Complaint.create({
      complaintCode: 'CF-2026-104921',
      citizenId: citizenUser1._id,
      categoryId: categories[0]._id,
      wardId: wards[0]._id,
      title: 'Deep crater pothole near metro pillar 42',
      description: 'Severe crater approximately 2.5 feet wide causing recurring two-wheeler accidents during evening peak traffic hours.',
      locationAddress: 'Under MG Road Metro Station Pillar 42, Central Promenade',
      landmark: 'Opposite City Center Mall Entrance',
      coordinates: { latitude: 12.971598, longitude: 77.594562 },
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop',
      priority: 'High',
      status: 'In Progress',
      assignedWorkerId: workerUser1._id,
      assignedAt: new Date(Date.now() - 48 * 3600 * 1000),
      submissionDate: new Date(Date.now() - 52 * 3600 * 1000),
      resolutionDeadline: new Date(Date.now() + 24 * 3600 * 1000),
      adminRemarks: 'Assigned to Ward 101 Road Rapid Response Team under Ramesh Kumar.',
    });

    const complaint2 = await Complaint.create({
      complaintCode: 'CF-2026-104922',
      citizenId: citizenUser2._id,
      categoryId: categories[1]._id,
      wardId: wards[1]._id,
      title: 'Major drinking water pipeline breach flooding sidewalk',
      description: 'Continuous pressurized clean drinking water spurting out from underground municipal line onto the walkway for 18+ hours.',
      locationAddress: 'Intersection of 5th Main & 9th Cross, North Suburbs',
      landmark: 'Adjacent to Cyber Park Gate 3',
      coordinates: { latitude: 13.035842, longitude: 77.597022 },
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=800&auto=format&fit=crop',
      priority: 'Urgent',
      status: 'Work Completed',
      assignedWorkerId: workerUser2._id,
      assignedAt: new Date(Date.now() - 36 * 3600 * 1000),
      submissionDate: new Date(Date.now() - 40 * 3600 * 1000),
      resolutionDeadline: new Date(Date.now() - 16 * 3600 * 1000),
      adminRemarks: 'Technician Manoj Gowda replaced the damaged 6-inch gasket sleeve.',
    });

    const complaint3 = await Complaint.create({
      complaintCode: 'CF-2026-104923',
      citizenId: citizenUser1._id,
      categoryId: categories[2]._id,
      wardId: wards[2]._id,
      title: 'Consecutive dark streetlights causing safety hazard',
      description: 'Entire stretch of 6 decorative lampposts completely dark for three consecutive nights, creating theft risk.',
      locationAddress: 'Heritage Fort Boulevard, Ward 103',
      landmark: 'Behind Old Clock Tower',
      coordinates: { latitude: 12.961021, longitude: 77.574012 },
      imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop',
      priority: 'Medium',
      status: 'Resolved',
      assignedWorkerId: workerUser3._id,
      assignedAt: new Date(Date.now() - 72 * 3600 * 1000),
      submissionDate: new Date(Date.now() - 80 * 3600 * 1000),
      resolutionDeadline: new Date(Date.now() - 44 * 3600 * 1000),
      resolvedAt: new Date(Date.now() - 30 * 3600 * 1000),
      adminRemarks: 'Bulbs and circuit breaker replaced. Verified working by electrical team.',
    });

    const complaint4 = await Complaint.create({
      complaintCode: 'CF-2026-104924',
      citizenId: citizenUser1._id,
      categoryId: categories[4]._id,
      wardId: wards[0]._id,
      title: 'Overflowing community dumpsters attracting strays',
      description: 'Commercial waste has piled up outside designated bins, blocking half of the pedestrian lane and generating foul odor.',
      locationAddress: '8th Cross, Commercial Market Lane',
      landmark: 'Near Wholesale Vegetable Mandi',
      coordinates: { latitude: 12.975411, longitude: 77.590214 },
      imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop',
      priority: 'High',
      status: 'Pending',
      submissionDate: new Date(Date.now() - 5 * 3600 * 1000),
      resolutionDeadline: new Date(Date.now() + 19 * 3600 * 1000),
    });

    const complaint5 = await Complaint.create({
      complaintCode: 'CF-2026-104925',
      citizenId: citizenUser2._id,
      categoryId: categories[3]._id,
      wardId: wards[1]._id,
      title: 'Blocked stormwater drain causing stagnant water pool',
      description: 'Monsoon drain inlet is completely choked with plastic silt; water has stagnated and begun breeding mosquitoes.',
      locationAddress: 'Tech Park Link Road, Ward 102',
      landmark: 'Near Bus Stop 14',
      coordinates: { latitude: 13.0412, longitude: 77.6015 },
      imageUrl: 'https://images.unsplash.com/photo-1584463699039-44810795493b?w=800&auto=format&fit=crop',
      priority: 'Medium',
      status: 'Pending',
      submissionDate: new Date(Date.now() - 8 * 3600 * 1000),
      resolutionDeadline: new Date(Date.now() + 16 * 3600 * 1000),
    });

    // 6. Assignments
    await Assignment.create([
      {
        complaintId: complaint1._id,
        workerId: workerUser1._id,
        assignedByAdminId: adminUser._id,
        status: 'In Progress',
        notes: 'Deploy rapid cold mix asphalt and secure safety cones immediately.',
        assignedAt: new Date(Date.now() - 48 * 3600 * 1000),
      },
      {
        complaintId: complaint2._id,
        workerId: workerUser2._id,
        assignedByAdminId: adminUser._id,
        status: 'Completed',
        notes: 'Shut main feeder gate valve and weld/clamp cracked steel pipe.',
        assignedAt: new Date(Date.now() - 36 * 3600 * 1000),
        completedAt: new Date(Date.now() - 10 * 3600 * 1000),
      },
      {
        complaintId: complaint3._id,
        workerId: workerUser3._id,
        assignedByAdminId: adminUser._id,
        status: 'Completed',
        notes: 'Inspect 400W LED fixtures and replace tripped MCB.',
        assignedAt: new Date(Date.now() - 72 * 3600 * 1000),
        completedAt: new Date(Date.now() - 30 * 3600 * 1000),
      },
    ]);

    // 7. Status History
    await StatusHistory.create([
      {
        complaintId: complaint1._id,
        previousStatus: null,
        newStatus: 'Pending',
        changedByUserId: citizenUser1._id,
        remarks: 'Complaint registered by citizen.',
        changedAt: new Date(Date.now() - 52 * 3600 * 1000),
      },
      {
        complaintId: complaint1._id,
        previousStatus: 'Pending',
        newStatus: 'Assigned',
        changedByUserId: adminUser._id,
        remarks: 'Assigned to technician Ramesh Kumar (Roads & Bridges).',
        changedAt: new Date(Date.now() - 48 * 3600 * 1000),
      },
      {
        complaintId: complaint1._id,
        previousStatus: 'Assigned',
        newStatus: 'In Progress',
        changedByUserId: workerUser1._id,
        remarks: 'Excavation and leveling commenced on site.',
        changedAt: new Date(Date.now() - 30 * 3600 * 1000),
      },
      {
        complaintId: complaint2._id,
        previousStatus: null,
        newStatus: 'Pending',
        changedByUserId: citizenUser2._id,
        remarks: 'Complaint registered by citizen.',
        changedAt: new Date(Date.now() - 40 * 3600 * 1000),
      },
      {
        complaintId: complaint2._id,
        previousStatus: 'Pending',
        newStatus: 'Assigned',
        changedByUserId: adminUser._id,
        remarks: 'Assigned to technician Manoj Gowda.',
        changedAt: new Date(Date.now() - 36 * 3600 * 1000),
      },
      {
        complaintId: complaint2._id,
        previousStatus: 'Assigned',
        newStatus: 'In Progress',
        changedByUserId: workerUser2._id,
        remarks: 'Excavating soil to access buried high-pressure conduit.',
        changedAt: new Date(Date.now() - 24 * 3600 * 1000),
      },
      {
        complaintId: complaint2._id,
        previousStatus: 'In Progress',
        newStatus: 'Work Completed',
        changedByUserId: workerUser2._id,
        remarks: 'Replaced ruptured flange and sealed with reinforcement collar.',
        changedAt: new Date(Date.now() - 10 * 3600 * 1000),
      },
      {
        complaintId: complaint3._id,
        previousStatus: 'Work Completed',
        newStatus: 'Resolved',
        changedByUserId: adminUser._id,
        remarks: 'Admin night survey verified illumination restored.',
        changedAt: new Date(Date.now() - 30 * 3600 * 1000),
      },
    ]);

    // 8. Repair Updates
    await RepairUpdate.create([
      {
        complaintId: complaint1._id,
        workerId: workerUser1._id,
        updateNotes: 'Coned off the traffic lane. Base stone layer compacted using plate vibrator.',
        beforeImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop',
        afterImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop',
        materialsUsed: 'Crushed stone aggregate 40mm, Bitumen emulsion RS-1',
        costIncurred: 4500,
        updateType: 'Repair In Progress',
      },
      {
        complaintId: complaint2._id,
        workerId: workerUser2._id,
        updateNotes: 'Successfully isolated water pressure and installed 150mm DI mechanical coupling with synthetic EPDM gasket.',
        beforeImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=800&auto=format&fit=crop',
        afterImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop',
        materialsUsed: '150mm Ductile Iron pipe collar, EPDM seal rings, 8 high-tensile bolts',
        costIncurred: 12800,
        updateType: 'Work Finished',
      },
      {
        complaintId: complaint3._id,
        workerId: workerUser3._id,
        updateNotes: 'Replaced blown surge protection devices and retrofitted 6 energy-efficient 90W LED fixtures.',
        beforeImageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop',
        afterImageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop',
        materialsUsed: '6x Philips 90W LED Luminaire, 10kV SPD unit, 32A MCB switch',
        costIncurred: 18500,
        updateType: 'Work Finished',
      },
    ]);

    // 9. Feedback
    await Feedback.create({
      complaintId: complaint3._id,
      citizenId: citizenUser1._id,
      rating: 5,
      satisfactionLevel: 'Very Satisfied',
      comments: 'Remarkable turnaround time! The avenue is brilliantly illuminated now and safe for late evening walkers.',
    });

    // 10. Notifications
    await Notification.create([
      {
        userId: citizenUser1._id,
        complaintId: complaint1._id,
        title: 'Repair Crew Dispatched',
        message: 'Field worker Ramesh Kumar has commenced site preparation on MG Road.',
        isRead: false,
        notificationType: 'status_update',
      },
      {
        userId: citizenUser2._id,
        complaintId: complaint2._id,
        title: 'Work Completed',
        message: 'Water leak repair has been completed by Manoj Gowda. Verification pending.',
        isRead: false,
        notificationType: 'status_update',
      },
      {
        userId: citizenUser1._id,
        complaintId: complaint3._id,
        title: 'Resolution Verified',
        message: 'Streetlights on Heritage Fort Boulevard are verified active. Thank you for your feedback!',
        isRead: true,
        notificationType: 'complaint_resolved',
      },
      {
        userId: workerUser1._id,
        complaintId: complaint1._id,
        title: 'New Work Order Assigned',
        message: 'You have been assigned to repair pothole crater #CF-2026-104921.',
        isRead: true,
        notificationType: 'assignment',
      },
    ]);

    console.log('[CivicFix] Database seeded successfully with initial data.');
  } catch (err) {
    console.error('[CivicFix] Seeding error:', err);
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  (async () => {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicfix';
      await mongoose.connect(uri);
      console.log(`[CivicFix Seeder] Connected to MongoDB at ${uri}`);
      await seedDatabase();
      await mongoose.disconnect();
      console.log('[CivicFix Seeder] Done.');
      process.exit(0);
    } catch (e) {
      console.error('[CivicFix Seeder] Failed:', e);
      process.exit(1);
    }
  })();
}
