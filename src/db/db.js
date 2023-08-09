const mysql = require('mysql2')
  
const pool = mysql.createPool({
    connectionLimit: 100, // Maximum number of connections in the pool
    host: 'localhost',
    user: 'hrm_web',
    password: 'EaZp0wG+hiZoixo7Yr[O',
    database: 'hrm_desa',
    port: 3306,
  });

module.exports = pool;