function loadVisits() {
    // staff_id = sessionStorage.getItem("staff_id");
    staff_role = sessionStorage.getItem("staff_role");
    staff_name = sessionStorage.getItem("staff_name");
    let doctor_id = sessionStorage.getItem("doctor_id");

    fetchVisits(doctor_id);

}

// Populates the visit table depending on who is logged in
function fetchVisits(doctor_id) {
    const gender = { 1: "Male", 2: "Female" }

    // Get today's date
    const today = new Date();

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const visitTable = document.getElementById("visitTable");

    fetch('/pvisits', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "doctor_id": doctor_id, "fr_date": today, "to_date": tomorrow })
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    const visits = res.data;
                    var count = 1;
                    var string;

                    visits.forEach(visit => {

                        string = `<tr class="clickable">`
                        string += `<td>${count}</td>`;
                        string += `<td onclick="openPatientDetails(${visit.patient_id}, ${staff_role})">${visit.patient_name} <span class="badge badge-primary" id="badge${count}">New</span></td>`;
                        string += `<td>${visit.patient_uniqueid}</td>`;
                        string += `<td>${visit.patient_age}</td>`;
                        string += `<td>${gender[visit.patient_gender]}</td>`;
                        string += `<td>${visit.patient_mobile}</td>`;
                        string += `<td>${visit.patient_address}</td>`;
                        string += `<td>${visit.doctor_name}</td>`;
                        string += `<td><i class ="fa fa-trash" onclick = "deleteVisit(${visit.visit_id})"></i></td>`;
                        string += "</tr>"

                        visitTable.innerHTML += string;

                        if (visit.visit_status == 0) badgeOff(`badge${count}`);
                        count++;

                    });


                } else alert(res.message);
            }).catch(error => {
                alert("Error1");
                console.log(error)
            })
        } else {
            alert(response?.status + ': ' + response?.statusText);

            (response?.status == 403) && logout();
        }
    }).catch(error => {
        alert("Error2");
        console.log(error)
    })
}

// Delete a visit by clicking trash icon
function deleteVisit(visit_id) {
    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this visit?");

    // If the user confirms, proceed with the delete operation
    if (isConfirmed) {
        fetch('/pvisit', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "visit_id": visit_id })
        }).then(response => {
            if (response.ok) {
                response.json().then(res => {
                    if (res.success) {
                        alert(res.message);
                        window.location.reload();
                    } else {
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
        });
    }
}

// Opens a patients history
function openPatientDetails(patient_id, staff_role) {
    if (staff_role == 0 || staff_role == 2) { // Admin or Doctor

        sessionStorage.setItem("patient_id", patient_id); // Adds patient id to session
        window.location.href = "/report";
    }
}

// Search Patient
$(document).ready(function () {
    $("#searchbar").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#visitTable tr").filter(function () {
            var name = $(this).find("td:eq(1)").text().toLowerCase();  // Adjust the index for the name column
            var uniqueId = $(this).find("td:eq(2)").text().toLowerCase();  // Adjust the index for the unique ID column
            var mobile = $(this).find("td:eq(5)").text().toLowerCase();  // Adjust the index for the mobile number column

            // Add conditions for other columns as needed
            // Only toggle the row if the value matches in the specified columns
            $(this).toggle(name.indexOf(value) > -1 || uniqueId.indexOf(value) > -1 || mobile.indexOf(value) > -1);
        });
    });
});

// Turn Badge off
function badgeOff(badge_id) {
    const badge = document.getElementById(badge_id);

    badge.style.display = "none";
}


