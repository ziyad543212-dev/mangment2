import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard-controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', requireAuth, asyncHandler(getDashboard));

export default router;
