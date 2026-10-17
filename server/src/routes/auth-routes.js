import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { currentUser, signin, signout, signup } from '../controllers/auth-controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signinSchema, signupSchema } from '../schemas/index.js';

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' }
});

router.post('/signup', authLimiter, validate(signupSchema), asyncHandler(signup));
router.post('/signin', authLimiter, validate(signinSchema), asyncHandler(signin));
router.post('/signout', signout);
router.get('/me', requireAuth, currentUser);

export default router;
