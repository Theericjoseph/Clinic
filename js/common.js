// Admin navBar
window.addEventListener("load", () => {

    let navBar = document.getElementById("navBar");

    let sRole = sessionStorage.getItem("staff_role");

    let sName = sessionStorage.getItem("staff_name");

    navBar.innerHTML += `<li style="float:right"><p class="currentUser">${sName}</p></li>`

    if (sRole == 0) { // Admin
        navBar.innerHTML += '<li><a id="sList" href="/staff-list">Staff List</a></li>';
        navBar.innerHTML += `<li style="float:right"><i class="fa-solid fa-user-tie usericon"></i></li>`
    }
    else if (sRole == 1) { // Receptionist
        navBar.innerHTML += `<li style="float:right"><i class="fa-solid fa-bell-concierge usericon"></i></li>`
    }
    else {
        navBar.innerHTML += `<li style="float:right"><i class="fa-solid fa-user-doctor usericon"></i></li>`
    }

});



function logout() { // Clears session storage and logs out
    sessionStorage.clear();
    window.location.href = '/login';
}