import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';

const app: Application = express();

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Helmet security headers with custom CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://www.google-analytics.com',
          'https://stats.g.doubleclick.net',
        ],
        connectSrc: ["'self'", 'https://www.google-analytics.com'],
        frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.google.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xContentTypeOptions: true,
    frameguard: { action: 'sameorigin' },
  })
);

// Static files with cache control
app.use(
  express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      }
    },
  })
);

// CORS Configuration
const allowedOrigin = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://194.163.173.117',
  'https://your-production-domain.com', // Add production domain
];

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true); // Allow Postman / SSR
    if (allowedOrigin.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('🔥 App is Running');
});

// API Routes
app.use('/api/v1', router);

// Global Error Handler and 404 Handler
app.use(globalErrorHandler);
app.use(notFound);

export default app;
