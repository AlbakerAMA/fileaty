const express = require('express');
const cors = require('cors');
const path = require('path');
// Load .env file from outside the public directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = require("./models");

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Auth routes
app.use('/api/auth', require('./routes/auth.routes'));

// File routes
app.use('/api/files', require('./routes/file.routes'));

// Comment routes
app.use('/api/comments', require('./routes/comment.routes'));

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Fileaty backend is running' });
});

// Export app for Vercel serverless functions
module.exports = app;

// Enhanced error handling for Vercel serverless deployment
const serverlessHandler = async (req, res) => {
  try {
    // Test database connection with timeout
    await Promise.race([
      db.sequelize.authenticate(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);
    console.log('Database connection successful');
    
    // Handle the request with the app
    return app(req, res);
  } catch (error) {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    // Send detailed error response
    return res.status(500).json({ 
      status: 'ERROR', 
      message: 'Application initialization failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports.handler = serverlessHandler;