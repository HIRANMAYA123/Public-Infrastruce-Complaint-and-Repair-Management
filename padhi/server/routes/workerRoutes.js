import express from 'express';
import {
  getMyTasks,
  getTaskDetails,
  updateTaskStatus,
  submitRepairUpdate,
} from '../controllers/workerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('field_worker'));

router.get('/tasks', getMyTasks);
router.get('/tasks/:id', getTaskDetails);
router.put('/tasks/:id/status', updateTaskStatus);
router.post(
  '/tasks/:id/updates',
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
  ]),
  submitRepairUpdate
);

export default router;
