const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
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

module.exports = db;