const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const parentRoutes = require('./routes/parentRoutes');
const vetRoutes = require('./routes/vetRoutes');
const resortRoutes = require('./routes/resortRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Allowed origins
const allowedOrigins = [
  process.env.FRONTENDAPP_URL,
  process.env.FRONTENDWEB_URL,
  'http://localhost:8081',
  'http://localhost:5173'
].filter(Boolean);

// CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expo-auth-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/resorts', resortRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send("Hello World !!");
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

/**
 * 🚨 IMPORTANT:
 * On Vercel, you must NOT call app.listen()
 * because Vercel provides its own server runtime.
 * So we comment this out:
 * 
 * const PORT = process.env.PORT || 3000;
 * app.listen(PORT, () => {
 *   console.log(`🚀 Server running on port ${PORT}`);
 *   console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8081'}`);
 *   console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
 * });
 */

// Export for Vercel
module.exports = app;
