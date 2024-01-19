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

//create db & tables
let tableSQL = `CREATE DATABASE IF NOT EXISTS clinic;


CREATE TABLE IF NOT EXISTS doctors (
    doctor_id int(11) NOT NULL AUTO_INCREMENT,
    doctor_staff_id int(11) NOT NULL DEFAULT 0,
    doctor_name varchar(50) DEFAULT NULL,
    doctor_imano varchar(50) DEFAULT NULL,
    doctor_status int(11) DEFAULT 1,
    doctor_schedule varchar(50) DEFAULT NULL COMMENT 'sun-1,mon-2.....',
    doctor_crtdon timestamp NULL DEFAULT NULL,
    PRIMARY KEY (doctor_id)
  );

  CREATE TABLE IF NOT EXISTS patient_details (
    patient_id int(11) NOT NULL AUTO_INCREMENT,
    patient_name varchar(50) DEFAULT NULL,
    patient_uniqueid varchar(50) DEFAULT NULL,
    patient_age varchar(50) DEFAULT NULL,
    patient_gender int(11) DEFAULT NULL,
    patient_address text DEFAULT NULL,
    patient_mobile varchar(50) DEFAULT NULL,
    patient_email varchar(50) DEFAULT NULL,
    patient_status int(11) DEFAULT 1,
    patient_crtby int(11) DEFAULT NULL,
    patient_crtdon timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (patient_id),
    UNIQUE KEY patient_uniqueid (patient_uniqueid)
  );

  CREATE TABLE IF NOT EXISTS patient_visit (
    visit_id int(11) NOT NULL AUTO_INCREMENT,
    visit_patient int(11) DEFAULT NULL,
    visit_doctor int(11) DEFAULT NULL,
    visit_prescription text DEFAULT NULL,
    visit_crtdby int(11) DEFAULT NULL,
    visit_crton timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (visit_id)
  );

  CREATE TABLE IF NOT EXISTS staff (
    staff_id int(11) NOT NULL AUTO_INCREMENT,
    staff_name varchar(150) DEFAULT NULL,
    staff_role int(11) DEFAULT NULL COMMENT '1-reception,2-doctor',
    staff_username varchar(50) DEFAULT NULL,
    staff_password varchar(50) DEFAULT NULL,
    staff_mobile varchar(50) DEFAULT NULL,
    staff_email varchar(50) DEFAULT NULL,
    staff_status int(11) DEFAULT 1,
    staff_crtdon timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (staff_id)
  ); 
`;
const aSQL = tableSQL.split(";");

async function createTables() {

    for (let i = 0; i < aSQL.length; i++) {
        const sSQL = aSQL[i].trim();
        if (!sSQL) continue;

        const myPromise = await new Promise((resolve, reject) => {
            db.query(sSQL, function (err, result) {
                if (err) {
                    console.log(err.sql)
                    debugger
                    // throw err;
                    reject(err)
                }
                result?.affectedRows && console.log("Table created.");
                resolve(true);
            });
        });


    };

};

createTables();
module.exports = db;
