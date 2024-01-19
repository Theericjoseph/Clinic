//apis.js
//@ts-check
"use strict";
const express = require("express");

const router = express.Router();

const jwt = require('jsonwebtoken');

const db = require("./db");       // Import the db module

const verifyAccessToken = require('./jwt');

router.get('/login', (req, res) => {
    res.sendFile('/html/login.html', { root: __dirname + './../' }); // Gets login.html from html folder
});

router.get('/', (req, res) => {
    res.sendFile('/html/login.html', { root: __dirname + './../' }); // Gets login.html from html folder
});

router.get('/staff', (req, res) => {
    res.sendFile('/html/addstaff.html', { root: __dirname + './../' }); // Gets staff.html from html folder
});

router.get('/staff-list', (req, res) => {
    res.sendFile('/html/staffList.html', { root: __dirname + './../' }); // Gets staffList.html from html folder
});

router.get('/patient-list', (req, res) => {
    res.sendFile('/html/patient.html', { root: __dirname + './../' }); // Gets patient.html from html folder
});

router.get('/visits', (req, res) => {
    res.sendFile('/html/visits.html', { root: __dirname + './../' }); // Gets visits.html from html folder
});

router.get('/customer', (req, res) => {
    res.sendFile('/html/customer.html', { root: __dirname + './../' }); // Gets customer.html from html folder
});

router.get('/report', (req, res) => {
    res.sendFile('/html/report.html', { root: __dirname + './../' }); // Gets report.html from html folder
});


// login (run async so that the program waits)
router.post('/userlogin', async (req, res) => {

    const { username, password } = req?.body; // ? used so an undefined value is added incase username and password not found, prevents server from shut down

    // Check for staff login
    // Promises are a way to handle asynchronous code more cleanly and avoid the infamous "callback hell" or "pyramid of doom."

    const results = await new Promise((resolve, reject) => { // Where to find syntax ?
        db.query("SELECT * FROM staff WHERE staff_username = ? AND staff_password = ?",
            [username, password],
            (error, results, fields) => {
                error ? reject(error) : resolve(results);
            });
    });

    if (!results?.[0]) return res.json({ "success": false, "message": "Invalid username or password" });

    const user = {
        "staff_id": results?.[0].staff_id
    };

    jwt.sign(user, 'secret', { expiresIn: "4h" }, (err, token) => {

        if (err) return res.json({ "success": false, "message": "Unable to generate token." });

        return res.json({
            success: true,
            token: token,
            "data": results,
            "message": "Logged in"
        });
    });

});

//verify jwt token before running API
router.use(verifyAccessToken);


// add staff (run asyn so that the program waits)

router.post('/staff', async (req, res) => {
    const { staff_name, staff_role, staff_username, staff_password, staff_mobile, staff_email, doctor_imano, doctor_schedule } = req?.body;


    if (!staff_name && !staff_role && !staff_username && !staff_password && !staff_mobile && !staff_email && !doctor_imano && !doctor_schedule) return res.json({ "success": false, "message": "No inputs found." });

    const result = await new Promise((resolve, reject) => {
        db.query("INSERT INTO staff (staff_name, staff_role, staff_username, staff_password, staff_mobile, staff_email) VALUES(?,?,?,?,?,?)",
            [staff_name, staff_role, staff_username, staff_password, staff_mobile, staff_email],
            (error, result, fields) => {
                error ? reject(error) : resolve(result);
            });
    });

    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while adding staff." });


    let staff_id = result?.insertId;
    console.log("result", result);
    console.log("insertId", result?.insertId); //prints auto-increment ID of the table

    // check if staff_role is Doctor and add to doctors table if staff_role=2
    if (staff_role == 2) {
        const result = await new Promise((resolve, reject) => {
            db.query("INSERT INTO doctors (doctor_staff_id, doctor_name, doctor_imano, doctor_schedule) VALUES(?,?,?,?)",
                [staff_id, staff_name, doctor_imano, doctor_schedule],
                (error, results, fields) => {
                    error ? reject(error) : resolve(results);
                });
        });

        if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while adding doctor." });
    }

    return res.json({ success: true, message: "Staff added successfully." });


});


// Update staff 
router.patch('/staff', async (req, res) => {

    const { staff_name, staff_role, staff_username, staff_password, staff_mobile, staff_email, doctor_imano, doctor_schedule, staff_id } = req?.body;

    // Check if all the fields are NULL
    if (!staff_name && !staff_role && !staff_username && !staff_password && !staff_mobile && !staff_email && !doctor_imano && !doctor_schedule && !staff_id) return res.json({ "success": false, "message": "No inputs found." });

    const result = await new Promise((resolve, reject) => {
        db.query("UPDATE staff SET staff_username =?, staff_name=?, staff_role=?, staff_password=?, staff_mobile=?, staff_email=? WHERE staff_id=?",
            [staff_username, staff_name, staff_role, staff_password, staff_mobile, staff_email, staff_id],
            (error, result, fields) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while updating staff." });

    // check if staff_role is Doctor
    //add to doctors table if staff_role=2

    if (staff_role == 2) {
        const result = await new Promise((resolve, reject) => {
            db.query("UPDATE  doctors SET doctor_name=?, doctor_imano=?, doctor_schedule=? WHERE doctor_staff_id=?",
                [staff_name, doctor_imano, doctor_schedule, staff_id],
                (error, results, fields) => {
                    error ? reject(error) : resolve(results);
                });
        });

        if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while updating doctor." });
    }

    return res.json({ success: true, message: "Staff updated successfully." });

});

// Get all staff
router.get('/allstaff', async (req, res) => {
    // console.log("t", req.headers.cookie);
    const result = await new Promise((resolve, reject) => {
        db.query("SELECT staff_id, staff_name, staff_role, staff_username,staff_mobile,staff_email, staff_status, DATE_FORMAT(staff_crtdon, '%d-%m-%y') AS created_on FROM staff WHERE staff_role !=0 ",
            [],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.[0]) return res.json({ "success": false, "message": "Error while getting staff data. " })

    return res.json({ "success": true, "data": result });
})

//get staff by id (search staff)
router.get('/staff/:id/:role', async (req, res) => {

    const { id, role } = req?.params;

    let queries;

    if (parseInt(role) == 1) queries = "SELECT * FROM staff WHERE staff_id=?";
    else queries = "SELECT * FROM staff LEFT JOIN doctors ON staff.staff_id = doctors.doctor_staff_id WHERE staff_id=?";


    const result = await new Promise((resolve, reject) => {
        db.query(queries,
            [id],
            (error, results, fields) => {
                error ? reject(error) : resolve(results);
            });
    });

    if (!result?.[0]) return res.json({ "success": false, "message": "Error while getting staff details." });

    return res.json({ success: true, data: result[0] });

});

// Delete staff
router.delete('/staff', async (req, res) => {
    const staff_id = req.body?.staff_id;

    console.log("staff id", staff_id);

    const result = await new Promise((resolve, reject) => {
        db.query("DELETE FROM staff WHERE staff_id=?",
            [staff_id],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    });

    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while deleting staff entry." });

    return res.json({ success: true, message: "Staff entry deleted successfully." });
})

// Add a patient
router.post('/patient', async (req, res) => {
    const { patient_name, patient_age, patient_gender, patient_address, patient_mobile, patient_email, staff_id, visit_doctor } = req?.body;

    // Check if patient is registered in Patient Details table
    const results = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM  patient_details WHERE patient_name=? AND patient_mobile=?",
            [patient_name, patient_mobile],
            (error, results, fields) => {
                error ? reject(error) : resolve(results);
            });
    });

    let patient_id = results[0]?.patient_id; // Gets the patient id

    // Generate unique patient id
    // Example usage:
    var patient_uniqueid;

    if (!results?.[0]) { // Patient not registered register patient

        patient_uniqueid = generateUniqueID();

        const result = await new Promise((resolve, reject) => {
            db.query("INSERT INTO patient_details (patient_name, patient_uniqueid, patient_age, patient_gender, patient_address, patient_mobile, patient_email, patient_status, patient_crtby) VALUES(?,?,?,?,?,?,?,1,?)",
                [patient_name, patient_uniqueid, patient_age, patient_gender, patient_address, patient_mobile, patient_email, staff_id],
                (error, result, fields) => {
                    error ? reject(error) : resolve(result);
                });
        });

        if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while adding patient." });

        patient_id = result?.insertId // Stores the new patient id 
    }
    else {// Patient registered so update patient details in Patient Table

        const result = await new Promise((resolve, reject) => {
            db.query("UPDATE patient_details SET patient_age = ?, patient_gender = ?, patient_address = ?, patient_email = ? WHERE patient_id = ?",
                [patient_age, patient_gender, patient_address, patient_email, patient_id],
                (error, result, fields) => {
                    error ? reject(error) : resolve(result);
                });
        });

        if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while updating patient details." });

    }

    // Add patient to Patient Visit table 
    const result1 = await new Promise((resolve, reject) => {
        db.query("INSERT INTO patient_visit (visit_patient, visit_doctor, visit_crtdby) VALUES(?,?,?)",
            [patient_id, visit_doctor, staff_id],
            (error, result, fields) => {
                error ? reject(error) : resolve(result);
            });
    });

    if (!result1?.affectedRows) return res.json({ "success": false, "message": "Error while adding visit." });

    return res.json({ success: true, message: "Patient added successfully.", uniqueid: patient_uniqueid });

})

// Update Patient
router.patch('/updatepatient', async (req, res) => {
    const { patient_name, patient_age, patient_gender, patient_address, patient_mobile, patient_email, patient_id } = req?.body;

    const result = await new Promise((resolve, reject) => {
        db.query("UPDATE patient_details SET patient_name=?, patient_age=?, patient_gender=?, patient_address=?, patient_mobile=?, patient_email=? WHERE patient_id=?",
            [patient_name, patient_age, patient_gender, patient_address, patient_mobile, patient_email, patient_id],
            (error, result, fields) => {
                error ? reject(error) : resolve(result);
            })
    })


    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while updating patient details." });

    return res.json({ "success": true, "message": "Patient updated successfully." });
})

// Search patient
router.post('/searchpatient', async (req, res) => {
    const { keyword } = req?.body;

    const result = await new Promise((resolve, reject) => {
        db.query("SELECT patient_id, patient_name, patient_uniqueid, patient_age, patient_gender, patient_address, patient_mobile, patient_email, patient_crtby, patient_status, DATE_FORMAT(patient_crtdon, '%d-%m-%y') AS created_on FROM patient_details WHERE patient_name LIKE ? OR patient_mobile LIKE ? OR patient_uniqueid LIKE ?",
            [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })
    if (!result?.[0]) return res.json({ "success": false, "message": "No patient found." });

    return res.json({ success: true, data: result });
})

// Get all Patients
router.post('/allpatients', async (req, res) => {

    const { fr_date, to_date } = req?.body

    const result = await new Promise((resolve, reject) => {
        db.query("SELECT patient_id, patient_name, patient_uniqueid, patient_age, patient_gender, patient_address, patient_mobile, patient_email, patient_status, patient_crtby, DATE_FORMAT(patient_crtdon, '%d-%m-%y') AS created_on FROM patient_details WHERE patient_crtdon BETWEEN ? AND ?",
            [fr_date, to_date],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.[0]) return res.json({ "success": true, "message": "Error while getting patient details." });
    return res.json({ "success": true, data: result });

})

// Get 1 patient by ID
router.get('/patient/:id', async (req, res) => {

    const { id } = req?.params;

    let queries = "SELECT * FROM patient_details WHERE patient_id=?";

    const result = await new Promise((resolve, reject) => {
        db.query(queries,
            [id],
            (error, results, fields) => {
                error ? reject(error) : resolve(results);
            });
    });



    if (!result?.[0]) return res.json({ "success": false, "message": "Error while getting patient details." });

    return res.json({ success: true, data: result });

});

// Delete patient
router.delete('/patient', async (req, res) => {
    const patient_id = req.body?.patient_id;

    const result = await new Promise((resolve, reject) => {
        db.query("DELETE FROM patient_details WHERE patient_id=?",
            [patient_id],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    });

    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while deleting patient entry." });

    return res.json({ success: true, message: "Patient entry deleted successfully." });
})

// Get all Patient Visits of a Patient 
router.post('/pvisits', async (req, res) => {
    const { doctor_id, fr_date, to_date } = req?.body;

    if (!doctor_id) {
        const result = await new Promise((resolve, reject) => {
            db.query("SELECT patient_id, patient_name, patient_uniqueid, patient_age, patient_gender, patient_address, patient_mobile, patient_email,visit_doctor, visit_prescription, visit_id, doctor_name, visit_status, DATE_FORMAT(visit_crton, '%d-%m-%y') AS visited_on FROM patient_visit LEFT JOIN patient_details ON patient_visit.visit_patient = patient_details.patient_id LEFT JOIN doctors ON patient_visit.visit_doctor = doctors.doctor_id WHERE visit_crton BETWEEN ? AND ?",
                [fr_date, to_date],
                (error, result, field) => {
                    error ? reject(error) : resolve(result)
                })
        })
        if (!result?.[0]) return res.json({ "success": false, "message": "No patient found." });
        return res.json({ success: true, data: result });

    } else {

        const result = await new Promise((resolve, reject) => {
            db.query("SELECT patient_id, patient_name, patient_uniqueid, patient_age, patient_gender, patient_address, patient_mobile, patient_email,visit_doctor, visit_prescription, visit_id, doctor_name, visit_status, DATE_FORMAT(visit_crton, '%d-%m-%y') AS visited_on FROM patient_visit LEFT JOIN patient_details ON patient_visit.visit_patient = patient_details.patient_id LEFT JOIN doctors ON patient_visit.visit_doctor = doctors.doctor_id WHERE visit_doctor =  ? and visit_crton BETWEEN ? AND ?",
                [doctor_id, fr_date, to_date],
                (error, result, field) => {
                    error ? reject(error) : resolve(result)
                })
        })
        if (!result?.[0]) return res.json({ "success": false, "message": "No patient found." });
        return res.json({ success: true, data: result });
    }


})

// Delete patient visit
router.delete('/pvisit', async (req, res) => {
    const visit_id = req.body?.visit_id;


    const result = await new Promise((resolve, reject) => {
        db.query("DELETE FROM patient_visit WHERE visit_id=?",
            [visit_id],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    });

    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while deleting patient entry." });

    return res.json({ success: true, message: "Patient visit entry deleted successfully." });
})

// Get Doctor schedule
router.post('/doctor', async (req, res) => {
    const { day } = req?.body;

    const result = await new Promise((resolve, reject) => {
        db.query("SELECT doctor_id, doctor_name, doctor_schedule FROM doctors WHERE doctor_schedule LIKE ?",
            [`%${day}%`],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.[0]) return res.json({ "success": false, "message": "No doctors found" });
    return res.json({ success: true, data: result });

})

// Get 1 Doctor by staff id
router.post('/docid', async (req, res) => {
    const { staff_id } = req?.body;

    const result = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM doctors WHERE doctor_staff_id = ?",
            [staff_id],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.[0]) return res.json({ "success": false, "message": "No doctors found" });
    return res.json({ success: true, data: result });

})

// Get Doctors name by Doc id
router.post('/docname', async (req, res) => {
    const { doc_id } = req?.body;

    const result = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM doctors WHERE doctor_id = ?",
            [doc_id],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.[0]) return res.json({ "success": false, "message": "No doctors found" });
    return res.json({ success: true, data: result });

})

// Get all details of 1 Patient
router.get('/pvisits/:patient_id', async (req, res) => {
    const { patient_id } = req?.params;

    const result = await new Promise((resolve, reject) => {
        db.query("SELECT patient_name, patient_age, patient_gender, patient_mobile, visit_id, visit_condition, visit_prescription, DATE_FORMAT(visit_crton, '%d-%m-%y') AS visited_on FROM patient_visit LEFT JOIN patient_details ON patient_details.patient_id = patient_visit.visit_patient WHERE patient_id = ?",
            [patient_id],
            (error, result, field) => {
                error ? reject(error) : resolve(result)
            })
    })

    if (!result?.[0]) return res.json({ "success": false, "message": "No visits found" });

    return res.json({ success: true, data: result });
})

// Update details of 1 Patient
router.patch('/pvisits', async (req, res) => {
    const { visit_condition, visit_prescription, visit_status, visit_id } = req?.body;

    const result = await new Promise((resolve, reject) => {
        db.query("UPDATE patient_visit SET visit_condition = ? , visit_prescription=?, visit_status = ? WHERE visit_id = ?",
            [visit_condition, visit_prescription, visit_status, visit_id],
            (error, result, fields) => {
                error ? reject(error) : resolve(result);
            })
    })

    if (!result?.affectedRows) return res.json({ "success": false, "message": "Error while updating patient details." });

    return res.json({ "success": true, "message": "Patient updated successfully." });
})

// Functions

// Function that generates a unique ID (patient_uniqueID)
function generateUniqueID() {
    const timestamp = new Date().getTime().toString(36);
    const randomPart1 = Math.random().toString(36).substr(2, 4);
    const randomPart2 = Math.random().toString(36).substr(2, 4);


    const uniqueID = timestamp + randomPart1 + randomPart2;

    return uniqueID.slice(5, 16).toUpperCase(); // Trim to 10 characters
}

module.exports = router;