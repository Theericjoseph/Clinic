// Fetch call to display staff list table
function fetchAllStaffData() {
    const staffDataTable = document.getElementById("stafftable");
    staffDataTable.innerHTML = '';

    const roles = { 1: "Receptionist", 2: "Doctor" };
    const status = { 1: "Active", 2: "Inactive" };

    fetch('/allstaff', {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    const staffList = res.data;
                    let string;
                    staffList.forEach(element => {
                        string = "<tr>";
                        string += `<td>${element.staff_name}</td>`;
                        string += `<td>${roles[element.staff_role]}</td>`;
                        string += `<td>${element.staff_username}</td>`;
                        string += `<td>${element.staff_mobile}</td>`;
                        string += `<td>${element.staff_email}</td>`;
                        string += `<td>${status[element.staff_status]}</td>`;
                        string += `<td>${element.created_on}</td>`;
                        string += `<td><i class="fa fa-edit" onclick="fetchStaff(${element.staff_id}, ${element.staff_role});"></i> <i class ="fa fa-trash" onclick = "deleteStaff(${element.staff_id})"></i></td>`;

                        string += "</tr>"

                        staffDataTable.innerHTML += string;
                    });
                } else {
                    alert(res.message); // Creates an alert box
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
        alert(error);
        console.log(error)
    })
}

//Get 1 staff by staffid
fetchStaff = (staff_id, role) => {
    modal.style.display = "block";


    $.ajax({
        type: "GET",
        url: `/staff/${staff_id}/${role}`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.success == true) {

                // Puts existing staff details in the columns 
                document.getElementById("staff_id").value = response.data.staff_id
                document.getElementById("staff_name").value = response.data.staff_name
                document.getElementById("staff_role").value = response.data.staff_role
                document.getElementById("staff_username").value = response.data.staff_username
                document.getElementById("staff_password").value = response.data.staff_password
                document.getElementById("staff_mobile").value = response.data.staff_mobile
                document.getElementById("staff_email").value = response.data.staff_email

                // Handles extra columns for Doctors
                if (response.data.staff_role == 2) {

                    toggleDoctorFields();

                    // Displays Doctor IMANO
                    document.getElementById("doctor_imano").value = response.data.doctor_imano
                    // Splits schedule string into separate value 
                    var schedules = response.data.doctor_schedule.split(',');


                    // Checks corresponding checkboxes
                    schedules.forEach(value => {
                        const checkbox = document.querySelector(`input[name="doctor_schedule"][value="${value}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });

                }
            }
            else {
                alert(response.message);
            }

        },
        failure: function (response) {
            alert(response?.status + ': ' + response?.statusText);
            (response?.status == 403) && logout();

        },
        error: function (response) {
            alert(response?.status + ': ' + response?.statusText);
            (response?.status == 403) && logout();
        }
    });
}

// Update staff
function updateStaff(form, ev) {
    ev.preventDefault(); // Prevents the form from submitting traditionally

    // Loop through the form to create a Json (data) representing the values in the form
    var formData = new FormData(form);
    var data = {}
    formData.forEach((value, key) => {
        data[key] = value;
    })


    // Converts the checkbox values into a schedule string to input to the db
    var selectedVal = [];
    var cbs = document.querySelectorAll(`input[name = "doctor_schedule"]:checked`);
    cbs.forEach(cb => {
        selectedVal.push(cb.value);
    })
    const schedule = selectedVal.join(',');
    data["doctor_schedule"] = schedule;


    fetch('/staff', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    alert(res.message);
                    window.location.reload();
                } else {
                    alert(res.message); // Creates an alert box
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

// Delete Staff
function deleteStaff(staff_id) {

    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this staff?");

    if (isConfirmed) {


        fetch('/staff', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "staff_id": staff_id })
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

// Functions

//reset doctor fields when modal closed
function resetInputs() {

    // Resets IMANO
    document.getElementById("doctor_imano").value = null;

    // Resets the checkboxes
    const cbs = document.querySelectorAll(`input[name = "doctor_schedule"]:checked`);
    cbs.forEach(cb => {
        cb.checked = false;
    })

    // Doctor fields display set back to default (none).
    const doctorFields = document.querySelectorAll('.doctor-fields');

    doctorFields.forEach(field => {
        field.style.display = "none";
    })
}

function toggleDoctorFields() {
    const roleSelect = document.getElementById('staff_role');
    const doctorFields = document.querySelectorAll('.doctor-fields');

    doctorFields.forEach(field => {
        field.style.display = roleSelect.value === '2' ? 'block' : 'none';
    });
}