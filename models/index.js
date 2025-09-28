const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require('sequelize');

// Log configuration for debugging
console.log('Database configuration:', {
  host: dbConfig.HOST,
  user: dbConfig.USER,
  database: dbConfig.DB,
  dialect: dbConfig.dialect
});

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  dialectOptions: dbConfig.dialectOptions,
  keepDefaultTimezone: dbConfig.keepDefaultTimezone
});

// Handle connection for serverless environments
sequelize.beforeConnect(() => {
  console.log('Connecting to database...');
});

sequelize.afterConnect(() => {
  console.log('Connected to database');
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./user.model.js")(sequelize, DataTypes);
db.File = require("./file.model.js")(sequelize, DataTypes);
db.Comment = require("./comment.model.js")(sequelize, DataTypes);

// Define relationships
db.User.hasMany(db.File, {
  foreignKey: "uploaderId",
  as: "files"
});

db.File.belongsTo(db.User, {
  foreignKey: "uploaderId",
  as: "uploader"
});

db.File.hasMany(db.Comment, {
  foreignKey: "fileId",
  as: "comments"
});

db.Comment.belongsTo(db.File, {
  foreignKey: "fileId",
  as: "file"
});

db.User.hasMany(db.Comment, {
  foreignKey: "userId",
  as: "comments"
});

db.Comment.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user"
});

// Export a function to connect to the database with better error handling
db.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    return false;
  }
};

// Export a function to close the database connection
db.close = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    return true;
  } catch (error) {
    console.error('Error closing database connection:', error);
    return false;
  }
};

module.exports = db;