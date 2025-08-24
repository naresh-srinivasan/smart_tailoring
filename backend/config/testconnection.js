import sequelize from './database.js';

async function testconnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
console.log('Starting database connection test...');
testconnection();