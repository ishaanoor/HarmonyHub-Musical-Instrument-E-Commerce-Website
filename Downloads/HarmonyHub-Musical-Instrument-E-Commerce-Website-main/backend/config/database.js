const { Pool } = require('pg');
require('dotenv').config();


const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/harmonyhub';

const pool = new Pool({
  connectionString: connectionString,
  ssl: false
});

pool.on('connect', () => {
  console.log('PostgreSQL database pool connected successfully.');
});

module.exports = pool;

