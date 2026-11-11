
let donors = JSON.parse(localStorage.getItem("donors")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function saveDonors() {
    localStorage.setItem("donors", JSON.stringify(donors));
}

function saveRequests() {
    localStorage.setItem("requests", JSON.stringify(requests));
}

// Donor Registration
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const blood = document.getElementById("regBlood").value;
    const location = document.getElementById("regLocation").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

    if (donors.some(d => d.email === email)) {
        document.getElementById("registerMessage").textContent =
            "Email already registered.";
        return;
    }

    donors.push({
        id: Date.now(),
        name,
        email,
        password,
        blood,
        location,
        phone,
        available: true
    });

    saveDonors();

    document.getElementById("registerMessage").textContent =
        "Registration successful!";

    this.reset();
});

// Donor Login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const donor = donors.find(
        d => d.email === email && d.password === password
    );

    if (donor) {
        currentUser = donor;
        localStorage.setItem("currentUser", JSON.stringify(donor));

        document.getElementById("loginMessage").textContent =
            "Login successful!";

        updateDashboard();
        this.reset();
    } else {
        document.getElementById("loginMessage").textContent =
            "Invalid email or password.";
    }
});

// Dashboard
function updateDashboard() {
    const message = document.getElementById("dashboardMessage");

    if (currentUser) {
        message.textContent =
            "Welcome " + currentUser.name +
            " | Blood Group: " + currentUser.blood +
            " | Availability: " +
            (currentUser.available ? "Available" : "Unavailable");
    } else {
        message.textContent = "Please login to view your dashboard.";
    }
}

// Search Donors
document.getElementById("searchButton").addEventListener("click", function() {
    const blood = document.getElementById("searchBlood").value;
    const location = document.getElementById("searchLocation")
        .value.trim().toLowerCase();

    const results = donors.filter(donor => {
        return (!blood || donor.blood === blood) &&
            (!location || donor.location.toLowerCase().includes(location)) &&
            donor.available;
    });

    const container = document.getElementById("donorResults");
    container.innerHTML = "";

    if (results.length === 0) {
        container.textContent = "No available donors found.";
        return;
    }

    results.forEach(donor => {
        const card = document.createElement("div");
        card.className = "donor-card";

        const name = document.createElement("h3");
        name.textContent = donor.name;

        const details = document.createElement("p");
        details.textContent =
            "Blood Group: " + donor.blood +
            " | Location: " + donor.location +
            " | Phone: " + donor.phone;

        card.appendChild(name);
        card.appendChild(details);
        container.appendChild(card);
    });
});

// Blood Request
document.getElementById("requestForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const request = {
        patient: document.getElementById("patientName").value.trim(),
        blood: document.getElementById("requestBlood").value,
        hospital: document.getElementById("hospital").value.trim(),
        location: document.getElementById("requestLocation").value.trim(),
        contact: document.getElementById("contactNumber").value.trim(),
        date: new Date().toLocaleString()
    };

    requests.push(request);
    saveRequests();

    document.getElementById("requestMessage").textContent =
        "Blood request submitted successfully!";

    this.reset();
});

// Toggle Availability
document.getElementById("availabilityButton").addEventListener("click", function() {
    if (!currentUser) {
        alert("Please login first.");
        return;
    }

    const donor = donors.find(d => d.id === currentUser.id);

    if (donor) {
        donor.available = !donor.available;
        currentUser = donor;

        saveDonors();
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        updateDashboard();
    }
});

// Logout
document.getElementById("logoutButton").addEventListener("click", function() {
    currentUser = null;
    localStorage.removeItem("currentUser");

    updateDashboard();

    document.getElementById("loginMessage").textContent =
        "Logged out successfully.";
});

// Initialize
updateDashboard();
