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
    // database: process.env.MYSQL_DB
});

//create db & tables
let tableSQL = `CREATE DATABASE IF NOT EXISTS clinic;
USE clinic;

CREATE TABLE IF NOT EXISTS staff (
  staff_id int NOT NULL AUTO_INCREMENT,
  staff_name varchar(150) DEFAULT NULL,
  staff_role int DEFAULT NULL COMMENT '1-reception,2-doctor',
  staff_username varchar(50) DEFAULT NULL,
  staff_password varchar(50) DEFAULT NULL,
  staff_mobile varchar(50) DEFAULT NULL,
  staff_email varchar(50) DEFAULT NULL,
  staff_status int DEFAULT '1',
  staff_crtdon timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (staff_id)
); 

CREATE TABLE IF NOT EXISTS doctors (
    doctor_id int NOT NULL AUTO_INCREMENT,
    doctor_staff_id int NOT NULL DEFAULT '0',
    doctor_name varchar(50) DEFAULT NULL,
    doctor_imano varchar(50) DEFAULT NULL,
    doctor_status int DEFAULT '1',
    doctor_schedule varchar(50) DEFAULT NULL COMMENT 'sun-1,mon-2.....',
    doctor_crtdon timestamp NULL DEFAULT (now()),
    PRIMARY KEY (doctor_id),
    UNIQUE KEY doctor_staff_id (doctor_staff_id),
    CONSTRAINT FK_doctors_staff FOREIGN KEY (doctor_staff_id) REFERENCES staff (staff_id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS patient_details (
    patient_id int NOT NULL AUTO_INCREMENT,
    patient_name varchar(50) DEFAULT NULL,
    patient_uniqueid varchar(50) DEFAULT NULL,
    patient_age varchar(50) DEFAULT NULL,
    patient_gender int DEFAULT NULL,
    patient_address text,
    patient_mobile varchar(50) DEFAULT NULL,
    patient_email varchar(50) DEFAULT NULL,
    patient_status int DEFAULT '1',
    patient_crtby int DEFAULT NULL,
    patient_crtdon timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (patient_id),
    UNIQUE KEY patient_uniqueid (patient_uniqueid)
  );

  CREATE TABLE IF NOT EXISTS patient_visit (
    visit_id int NOT NULL AUTO_INCREMENT,
    visit_patient int DEFAULT NULL,
    visit_doctor int DEFAULT NULL,
    visit_condition varchar(200) DEFAULT NULL COMMENT 'Patients Condition',
    visit_prescription text,
    visit_crtdby int DEFAULT NULL,
    visit_crton timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    visit_status int DEFAULT '1' COMMENT '1-new visit, 5-seen ',
    PRIMARY KEY (visit_id),
    KEY FK_patient_visit_patient_details (visit_patient),
    KEY FK_patient_visit_doctors (visit_doctor),
    CONSTRAINT FK_patient_visit_doctors FOREIGN KEY (visit_doctor) REFERENCES doctors (doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_patient_visit_patient_details FOREIGN KEY (visit_patient) REFERENCES patient_details (patient_id) ON DELETE CASCADE ON UPDATE CASCADE
  );



`;

// Function to create table
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


async function createAdmin() {

  //check if already exists
  const myPromise = await new Promise((resolve, reject) => {
    db.query('SELECT  * FROM clinic.staff WHERE staff_role =0', 
    (error, results, fields) => {
      error ? reject(error) : resolve(results);
    });
});


if(!myPromise[0]) {
  //add admin

  const myPromise = await new Promise((resolve, reject) => {
    db.query('INSERT INTO `clinic`.`staff` (`staff_id`, `staff_name`, `staff_role`, `staff_username`, `staff_password`) VALUES (1, ?, 0, ?, ?);',
    ['admin', 'admin', 'admin123'], 
    (error, results, fields) => {
      error ? reject(error) : resolve(results);
    });
});
}
}

setTimeout(function () {
  createAdmin();
}, 100)

module.exports = db;
