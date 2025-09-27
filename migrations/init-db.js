const { sequelize } = require('../models');

async function initDatabase() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models to the database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
    
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Unable to initialize database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the initialization
initDatabase();