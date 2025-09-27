const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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
const { User, File, Comment } = db;

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database synced successfully.");
}).catch((err) => {
  console.log("Failed to sync database: " + err.message);
});

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

// Export app for testing
module.exports = app;

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}