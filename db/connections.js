// Imports mySQL and .env
const mysql = require('mysql2');
require('dotenv').config();

// Establish mysql connections
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: 'management_db'
    },
    console.log(`Connected to the management_db database.`)
  );

  // Exports database
  module.exports = db;