//db.js
"use strict";

const mysql = require('mysql');

// Create a connection pool
const db = mysql.createPool({
    connectionLimit: 100,
    connectTimeout: 24 * 60 * 60 * 1000,
    acquireTimeout: 24 * 60 * 60 * 1000,
    timeout: 24 * 60 * 60 * 1000,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});


module.exports = db;
