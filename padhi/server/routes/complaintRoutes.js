import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  withdrawComplaint,
  reopenComplaint,
  submitFeedback,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('citizen'), upload.single('image'), createComplaint);
router.get('/my', authorize('citizen'), getMyComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', authorize('citizen'), upload.single('image'), updateComplaint);
router.post('/:id/withdraw', authorize('citizen'), withdrawComplaint);
router.post('/:id/reopen', authorize('citizen'), reopenComplaint);
router.post('/feedback', authorize('citizen'), submitFeedback);

export default router;
