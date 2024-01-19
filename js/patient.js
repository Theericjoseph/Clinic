// Get all Patients
function fetchAllPatients() {
    const patientTable = document.getElementById("patientTable");
    patientTable.innerHTML = '';

    // Get today's date
    var today = new Date();
    today.setDate(today.getDate() + 1);  // Set date to tmrw to get all patients registered today
    // Get today's date in the format YYYY-MM-DD
    const ftoday = new Date().toISOString().split('T')[0];

    // Get the date a week back
    var lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    // Format the date as YYYY-MM-DD
    const flastWeek = lastWeek.toISOString().split('T')[0];


    var fr_date = document.getElementById("fr_date").value;
    var to_date = document.getElementById("to_date").value;

    // Default to show all patients registered in a week
    if (!fr_date) {
        fr_date = lastWeek;
        document.getElementById("fr_date").value = flastWeek;
    }
    if (!to_date) {
        to_date = today;
        document.getElementById("to_date").value = ftoday;
    }

    const gender = { 1: "Male", 2: "Female" }

    fetch('/allpatients', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "fr_date": fr_date, "to_date": to_date })
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    const patientList = res.data
                    let string;
                    patientList.forEach(element => {
                        string = "<tr>";
                        string += `<td>${element.patient_name}</td>`;
                        string += `<td>${element.patient_uniqueid}</td>`;
                        string += `<td>${element.patient_age}</td>`;
                        string += `<td>${gender[element.patient_gender]}</td>`;
                        string += `<td>${element.patient_mobile}</td>`;
                        string += `<td>${element.patient_address}</td>`;
                        string += `<td>${element.patient_email}</td>`;
                        string += `<td>${element.created_on}</td>`;
                        string += `<td><i class="fa fa-edit " onclick="fetchPatient(${element.patient_id})" ></i> <i class ="fa fa-trash" onclick = "deletePatient(${element.patient_id})"></i></td>`;
                        string += "</tr>"

                        patientTable.innerHTML += string;

                    });

                }
                else {
                    alert(res.message);
                }
            }).catch(error => {
                alert("Error");
                console.log(error)
            })
        } else {
            alert(response?.status + ': ' + response?.statusText);

            (response?.status == 403) && logout();
        }
    }).catch(error => {
        alert("Error");
        console.log(error)
    })
}

// Search Patient
function searchPatient() {

    const patientTable = document.getElementById("patientTable");
    patientTable.innerHTML = '';

    const gender = { 1: "Male", 2: "Female" }

    const keyword = document.getElementById("searchbar").value

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
                        const patientList = res.data;

                        patientList.forEach(element => {
                            string = "<tr>";
                            string += `<td>${element.patient_name}</td>`;
                            string += `<td>${element.patient_uniqueid}</td>`;
                            string += `<td>${element.patient_age}</td>`;
                            string += `<td>${gender[element.patient_gender]}</td>`;
                            string += `<td>${element.patient_mobile}</td>`;
                            string += `<td>${element.patient_address}</td>`;
                            string += `<td>${element.patient_email}</td>`;
                            string += `<td>${element.created_on}</td>`;
                            string += `<td><i class="fa fa-edit " onclick="fetchPatient(${element.patient_id})" ></i> <i class ="fa fa-trash" onclick = "deletePatient(${element.patient_id})"></i></td>`;
                            string += "</tr>"

                            patientTable.innerHTML += string;
                        })

                    } else alert(res.message);
                }).catch(error => {
                    alert("Error");
                    console.log(error)
                })
            } else {
                alert(response?.status + ': ' + response?.statusText);

                (response?.status == 403) && logout();
            }
        }).catch(error => {
            alert("Error");
            console.log(error)
        })
    } else fetchAllPatients();
}


// Get 1 patient
function fetchPatient(patient_id) {

    $('#editPatient').modal('show'); // Displays the modal

    fetch(`/patient/${patient_id}`, {
        method: "GET",
        header: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {

                    // Puts existing patient details in the columns
                    document.getElementById("patient_id").value = res.data[0].patient_id;
                    document.getElementById("patient_name").value = res.data[0].patient_name;
                    document.getElementById("patient_age").value = res.data[0].patient_age;
                    document.getElementById("patient_gender").value = res.data[0].patient_gender;
                    document.getElementById("patient_address").value = res.data[0].patient_address;
                    document.getElementById("patient_mobile").value = res.data[0].patient_mobile;
                    document.getElementById("patient_email").value = res.data[0].patient_email;

                }
                else alert(res.message);
            }).catch(error => {
                alert("Error");
                console.log(error)
            })
        } else {
            alert(response?.status + ': ' + response?.statusText);

            (response?.status == 403) && logout();
        }
    }).catch(error => {
        alert("Error");
        console.log(error)
    })
};

// Update Patient

function updatePatient(ev) {
    ev.preventDefault();

    const patientForm = new FormData(document.getElementById("patient_form"));

    var object = {};
    patientForm.forEach(function (value, key) {
        object[key] = value;
    });
    var json1 = JSON.stringify(object);

    fetch('/updatepatient', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: json1

    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {

                    alert(res.message); // Updated Successfully
                    window.location.reload();

                } else alert(res.message); // Update Failed

            }).catch(error => {
                alert("Error");
                console.log(error)
            })
        } else {
            alert(response?.status + ': ' + response?.statusText);

            (response?.status == 403) && logout();
        }
    }).catch(error => {
        alert("Error");
        console.log(error)
    })
}

// Delete Patient
function deletePatient(patient_id) {
    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this Patient?");
    if (isConfirmed) {


        fetch('/patient', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "patient_id": patient_id })
        }).then(response => {
            if (response.ok) {
                response.json().then(res => {
                    if (res.success) {

                        alert(res.message);
                        window.location.reload();
                    }
                    else alert(res.message);
                }).catch(error => {
                    alert("Error");
                    console.log(error)
                })
            } else {
                alert(response?.status + ': ' + response?.statusText);

                (response?.status == 403) && logout();
            }
        }).catch(error => {
            alert("Error");
            console.log(error)
        })
    }
}

// // Search Patient
// $(document).ready(function () {
//     $("#searchbar").on("keyup", function () {
//         var value = $(this).val().toLowerCase();
//         $("#patientTable tr").filter(function () {
//             var name = $(this).find("td:eq(0)").text().toLowerCase();  // Adjust the index for the name column
//             var uniqueId = $(this).find("td:eq(1)").text().toLowerCase();  // Adjust the index for the unique ID column
//             var mobile = $(this).find("td:eq(4)").text().toLowerCase();  // Adjust the index for the mobile number column

//             // Add conditions for other columns as needed
//             // Only toggle the row if the value matches in the specified columns
//             $(this).toggle(name.indexOf(value) > -1 || uniqueId.indexOf(value) > -1 || mobile.indexOf(value) > -1);
//         });
//     });
// });


