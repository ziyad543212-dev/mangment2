import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { requireTrustedOrigin } from './middleware/origin.js';
import authRoutes from './routes/auth-routes.js';
import dashboardRoutes from './routes/dashboard-routes.js';
import projectRoutes from './routes/project-routes.js';

export const app = express();

if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());

// دالة التحقق المرنة من النطاقات المسموحة
const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (origin === process.env.CLIENT_ORIGIN) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (origin.startsWith('http://localhost:')) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// الاستجابة لطلبات الـ Preflight لجميع المسارات
app.options('*', cors());

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

// فحص الـ Origin للطلبات التي تعدل البيانات
app.use('/api', (req, res, next) => {
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.headers.origin;
    if (isOriginAllowed(origin)) {
      return next();
    }
    return requireTrustedOrigin(req, res, next);
  }
  return next();
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFound);
app.use(errorHandler);