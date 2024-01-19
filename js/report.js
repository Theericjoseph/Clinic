
function loadDetails() {

    const gender = { 1: "Male", 2: "Female" }

    const patient_id = sessionStorage.getItem("patient_id");

    fetch(`/pvisits/${patient_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {

                    const visits = res.data;

                    // Display Patient Details

                    document.getElementById("p_name").innerHTML = `<p>${visits[0].patient_name}</p>`
                    document.getElementById("p_age").innerHTML = `<p>${visits[0].patient_age}</p>`
                    document.getElementById("p_gender").innerHTML = `<p>${gender[visits[0].patient_gender]}</p>`
                    document.getElementById("p_mobile").innerHTML = `<p>${visits[0].patient_mobile}</p>`

                    var count = 0;
                    var numVisits = visits.length;
                    // console.log("numVisits", numVisits);
                    let string = '';
                    // Display Accordian

                    for (let i = 0; i < numVisits; i++) {
                        count++;
                        // console.log(count);

                        let coll = "";
                        let show = "show";
                        let readonly = ""

                        if (count != numVisits) {
                            coll = "collapsed";
                            show = "";
                            readonly = "readonly";
                        } else {
                            count = "";
                            sessionStorage.setItem("visit_id", visits[i].visit_id);    // Stores visit id to session
                        }

                        let condition = "";
                        let presc = "";
                        (visits[i].visit_condition) && (condition = visits[i].visit_condition); // Visit condition is black if value null in db
                        (visits[i].visit_prescription) && (visits[i].visit_prescription);       // Visit prescription is black if value null in db

                        // Accordian item 
                        string +=
                            `<div class="accordion-item">
                                <h2 class="accordion-header" id="panelsStayOpen-heading${count}">
                                    <button class="accordion-button ${coll}" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapse${count}" aria-expanded="true"
                                        aria-controls="panelsStayOpen-collapse${count}">
                                        Visit on ${visits[i].visited_on}
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapse${count}" class="accordion-collapse collapse ${show}"
                                    aria-labelledby="panelsStayOpen-heading${count}">
                                    <div class="accordion-body">
                                        <!-- Form -->
                                        <form>
                                            <div class="form-group mt-2">
                                                <label class="fw-bold">Condition</label>
                                                <textarea class="form-control" id="visit_condition${count}" rows="2" ${readonly}>${condition}</textarea>
                                            </div>
                                            <div class="form-group mt-2">
                                                <label class="fw-bold">Prescription</label>
                                                <textarea class="form-control" id="visit_prescription${count}" rows="4" ${readonly}>${presc}</textarea>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>`

                    };

                    // Accordian item added to accordian
                    document.getElementById("visits-accordian").innerHTML += string;

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
}

function saveDetails() {

    const visit_id = sessionStorage.getItem("visit_id");

    visit_condition = document.getElementById("visit_condition").value;

    visit_prescription = document.getElementById("visit_prescription").value;


    fetch(`/pvisits`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "visit_condition": visit_condition, "visit_prescription": visit_prescription, "visit_id": visit_id, "visit_status": 0 })
    }).then(response => {
        if (response.ok) {
            response.json().then(res => {
                if (res.success) {
                    alert(res.message);

                    sessionStorage.removeItem("patient_id"); // Removes patient_id from session
                    sessionStorage.removeItem("visit_id");   // Removes visit_id from session   
                    window.location.href = '/visits'

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
}
