function formAction(ev) {
    ev.preventDefault();

    const staffForm = new FormData(document.getElementById("staffForm"));

    var object = {};
    staffForm.forEach(function (value, key) {
        object[key] = value;
    });

    // Converts the checkbox values into a schedule string to input to the db
    var selectedVal = [];
    var cbs = document.querySelectorAll(`input[name = "doctor_schedule"]:checked`);
    cbs.forEach(cb => {
        selectedVal.push(cb.value);
    })
    const schedule = selectedVal.join(',');
    object["doctor_schedule"] = schedule;

    var json = JSON.stringify(object);

    fetch('/staff', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    alert(res.message);
                    window.location.href = '/staff-list'
                }
                else res.message;
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