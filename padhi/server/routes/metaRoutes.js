import express from 'express';
import {
  getCategories,
  getWards,
  getDepartments,
  getPublicStats,
} from '../controllers/metaController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/wards', getWards);
router.get('/departments', getDepartments);
router.get('/public-stats', getPublicStats);

export default router;
