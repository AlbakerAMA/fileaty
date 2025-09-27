#!/usr/bin/env node

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fileaty_db'
};

// Create a connection to the database
const connection = mysql.createConnection(config);

// Read the SQL schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  
  console.log('Connected to the database');
  
  // Execute the schema SQL
  connection.query(schemaSQL, (err, results) => {
    if (err) {
      console.error('Error importing schema:', err);
      process.exit(1);
    }
    
    console.log('Database schema imported successfully');
    console.log('Sample data inserted:');
    console.log('- 1 admin user (admin/admin123)');
    console.log('- 2 regular users (user1/user123, user2/user123)');
    console.log('- 2 sample files');
    console.log('- 3 sample comments');
    
    // Close the connection
    connection.end();
  });
});