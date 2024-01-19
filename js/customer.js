
function addCustomer(ev) {
    ev.preventDefault();

    const patientForm = new FormData(document.getElementById("customer_form"));

    var object = {};
    patientForm.forEach(function (value, key) {
        object[key] = value;
    });

    // // Adding default values
    // object[doctor_id] = null;
    // object[visit_prescription] = null;

    var json = JSON.stringify(object);

    fetch('/patient', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json

    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {

                    if (res.uniqueid != null) {
                        document.getElementById("patient_uniqueid").value = res.uniqueid; // Updates Hidden field with newly generated UniqueID
                    }
                    else document.getElementById("if_new").value = 0;   // Changes flag to 0 (change to existing customer)

                    alert(res.message); // Added Successfully

                    generateBill();


                } else alert(res.message); // Failed

            }).catch(error => {
                alert("Error");
                console.log("Error")
            })
        }
    }).catch(error => {
        alert("Error");
        console.log("Error")
    })
}

// Open Customer
function openSearch() {
    $('#searchCustomer').modal('show'); // Displays the modal
    getDocSched(); // Gets the names of the doctors working today

    const staff_id_no = sessionStorage.getItem("staff_role"); // Gets staff id from session storage 
    document.getElementById("staff_id").value = staff_id_no;  // Fills the staff id in the column
}

// Close Customer
function closeSearch() {
    $('#searchCustomer').modal('hide'); // Displays the modal
}

// Search Customer
function searchCustomer() {

    const customerTable = document.getElementById("customerTable");
    customerTable.innerHTML = '';

    const gender = { 1: "Male", 2: "Female" }

    const keyword = document.getElementById("customer_searchbar").value

    if (keyword != "") {
        fetch('/searchpatient', {
            method: "Post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "keyword": keyword })
        }).then(response => {
            if (response.ok) {
                response.json().then(res => {
                    if (res.success) {

                        let string;
                        const tableData = res.data;

                        tableData.forEach(element => {
                            string = `<tr onclick='getCustomerDetails(${element.patient_id})'>`;
                            string += `<td>${element.patient_name}</td>`;
                            string += `<td>${element.patient_uniqueid}</td>`;
                            string += `<td>${element.patient_age}</td>`;
                            string += `<td>${gender[element.patient_gender]}</td>`;
                            string += `<td>${element.patient_mobile}</td>`;
                            string += `<td>${element.patient_email}</td>`;
                            string += "</tr>"

                            customerTable.innerHTML += string;
                        })


                    } else alert(res.message);
                }).catch(error => {
                    alert("Error");
                    console.log("Error")
                })
            }
        }).catch(error => {
            alert("Error");
            console.log("Error")
        })
    }
}

// Get Customer Details
function getCustomerDetails(patient_id) {

    fetch(`/patient/${patient_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    $('#searchCustomer').modal('hide'); // Hides the modal

                    // Puts existing patient details in the columns
                    document.getElementById("patient_uniqueid").value = res.data[0].patient_uniqueid;
                    document.getElementById("patient_name").value = res.data[0].patient_name;
                    document.getElementById("patient_age").value = res.data[0].patient_age;
                    document.getElementById("patient_gender").value = res.data[0].patient_gender;
                    document.getElementById("patient_address").value = res.data[0].patient_address;
                    document.getElementById("patient_mobile").value = res.data[0].patient_mobile;
                    document.getElementById("patient_email").value = res.data[0].patient_email;


                } else alert(res.message);
            }).catch(error => {
                alert("Error");
                console.log("Error")
            })
        }
    }).catch(error => {
        alert("Error");
        console.log("Error")
    })
}

// Generate Bill
function generateBill() {


    const if_new = document.getElementById("if_new").value;
    let total_amt;

    parseInt(if_new) ? total_amt = "$250" : total_amt = "$200";

    const gender = { 1: "Male", 2: "Female" };

    document.getElementById("customer_uniqueid").innerHTML = document.getElementById("patient_uniqueid").value;
    document.getElementById("customer_name").innerHTML = document.getElementById("patient_name").value;
    document.getElementById("customer_age").innerHTML = document.getElementById("patient_age").value;
    document.getElementById("customer_gender").innerHTML = gender[document.getElementById("patient_gender").value];
    document.getElementById("customer_mobile").innerHTML = document.getElementById("patient_mobile").value;
    document.getElementById("customer_email").innerHTML = document.getElementById("patient_email").value;

    document.getElementById("total_amt").innerHTML = total_amt; // Sets new value of bill

}

// Get doctor schedule

function getDocSched() {

    // Create a new Date object
    const currentDate = new Date();

    // Get the current day as a number (0-6)
    const currentDayNumber = currentDate.getDay();

    fetch('/doctor', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "day": currentDayNumber })
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    let string;
                    doctors = res.data;

                    doctors.forEach(doctor => {
                        string = `<option value=${doctor.doctor_id}>${doctor.doctor_name}</option>`
                        document.getElementById("visit_doctor").innerHTML += string;
                    })


                } else alert(res.message);
            })
        }
    })
}

