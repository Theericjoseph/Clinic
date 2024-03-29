
function formAction(form, ev) {
    ev.preventDefault(); // Prevents the default file submission

    fetch('/userlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'username': form['username']?.value, 'password': form['password']?.value })
    }).then(response => {
        if (response.ok) // if response is ok 
        {
            // response.json converts the body text as a json
            // .then method is used to handle to resolved value of the json
            response.json().then(res => {
                if (res.success) {
                    sessionStorage.setItem("staff_id", res?.data[0]?.staff_id);
                    sessionStorage.setItem("staff_name", res?.data[0]?.staff_name);
                    sessionStorage.setItem("staff_role", res?.data[0]?.staff_role);

                    if (res?.data[0]?.staff_role == 2) { // Doctor id stored into session storage
                        getDocId(res?.data[0]?.staff_id);
                    }

                    alert(res.message); // Creates an alert box

                    document.cookie = "token=" + res.token; // Adds token to cookie

                    if (res.data[0].staff_role == 0) window.location.href = '/staff-list'; // If staff redirect to /staff-list
                    else { window.location.href = '/visits' }
                }
                else {
                    alert(res.message); // Creates an alert box
                    windows.location.reload();

                }
            }).catch(error => {
                alert("Error");
                console.log(error)
            })
        }
    }).catch(error => {
        alert("Error");
        console.log(error)
    })
}


// To get doctor id from staff id
function getDocId(staff_id) {
    fetch('/docid', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "staff_id": staff_id })
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    sessionStorage.setItem("doctor_id", res.data[0].doctor_id);
                }
                else {
                    alert(res.message); // Creates an alert box

                }
            }).catch(error => {
                alert("Error");
                console.log(error)
            })
        }
    }).catch(error => {
        alert("Error");
        console.log(error)
    })
}