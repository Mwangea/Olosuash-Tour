const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const adminRoutes = require('./routes/adminRoutes');
const tourRoutes = require('./routes/tourRoutes');
const heroRoutes = require('./routes/heroRoutes');
const bookingRouter = require('./routes/bookingRoutes');

// Passport config
require('./config/passport');

const app = express();

// Comprehensive CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',   // React development server
    'http://localhost:5173',   // Vite development server
    'http://localhost:8000',   // Backend server
    'https://olosuashi.com',  // Add this
    'https://www.olosuashi.com'   // Production frontend URL (add this)
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS
app.use(cors(corsOptions));

// Handle OPTIONS requests explicitly
app.options('*', cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Add trust proxy if behind a reverse proxy like Nginx or using a platform like Heroku
app.set('trust proxy', 1);

// More lenient general API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased from 100 to 200
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Add skip function for certain conditions if needed
  skip: (req) => {
    // Example: skip rate limiting for certain IPs or in development
    return process.env.NODE_ENV === 'development';
  }
});

// Stricter auth route limiting (often targeted by brute force)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 20 login attempts per hour
  message: 'Too many authentication attempts, please try again after an hour'
});

// Apply different rate limiters to different routes
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter); // Stricter limits on login attempts
app.use('/api/auth/register', authLimiter); // Stricter limits on registration

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});

// Body parser for JSON and urlencoded
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Add request logging in production for debugging rate limit issues
if (process.env.NODE_ENV === 'production') {
  // Simple request logger for debugging rate limit issues
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
  });
}

// Initialize passport
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/bookings', bookingRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running'
  });
});

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;