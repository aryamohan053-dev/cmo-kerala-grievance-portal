require('dotenv').config();
const app = require('./src/app');
const { initDatabase } = require('./src/database/db');

const PORT = process.env.PORT || 5000;

// Initialize database schema
initDatabase();

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  CM KERALA - PUBLIC GRIEVANCE REDRESSAL PORTAL API    `);
  console.log(`  Government of Kerala - Chief Minister's Office      `);
  console.log(`=======================================================`);
  console.log(`  Server running on port: ${PORT}`);
  console.log(`  REST API endpoint:       http://localhost:${PORT}/api`);
  console.log(`  Health Check:            http://localhost:${PORT}/api/health`);
  console.log(`  Environment:             ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});

module.exports = server;
