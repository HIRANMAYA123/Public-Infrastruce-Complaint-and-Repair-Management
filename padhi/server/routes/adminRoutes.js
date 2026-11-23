import express from 'express';
import {
  getDashboardStats,
  getAllComplaints,
  assignComplaint,
  updateComplaintStatus,
  getCitizens,
  getWorkers,
  createWorker,
  getDepartments,
  createDepartment,
  getWards,
  createWard,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/complaints', getAllComplaints);
router.post('/assign', assignComplaint);
router.post('/status', updateComplaintStatus);

router.get('/citizens', getCitizens);
router.get('/workers', getWorkers);
router.post('/workers', createWorker);

router.get('/departments', getDepartments);
router.post('/departments', createDepartment);

router.get('/wards', getWards);
router.post('/wards', createWard);

export default router;
