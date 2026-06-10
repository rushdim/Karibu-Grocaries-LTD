// Configuration: Set the production API endpoint hosted on Vercel
const API_URL = "https://karibu-grocaries-ltd.vercel.app"; 


/* --- UTILS: TOAST NOTIFICATIONS --- */
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    // Fade out and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* --- LOGIC: PASSWORD VISIBILITY TOGGLE --- */
const toggleBtn = document.querySelector('#togglePassword');
const passField = document.querySelector('#adminPass');
const eyeIcon = document.querySelector('#eyeIcon');

if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
        // Toggle the input type between password and text
        const type = passField.getAttribute('type') === 'password' ? 'text' : 'password';
        passField.setAttribute('type', type);
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
}

/* --- LOGIC: FORM SUBMISSION --- */
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();

    // Validate inputs locally
    if (!email || !password) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    try {
        // Send login credentials to the Vercel backend API
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let data;
        try {
            data = await response.json();
        } catch (err) {
            console.error("Invalid JSON response from server");
            showToast("Server returned an invalid response", "error");
            return;
        }

        if (response.ok) {
            // Explicitly check if the user logging in matches the Admin credentials
            const isAdmin = (email.toLowerCase() === "karibugroceries@gmail.com") && (password === "Rushdi@1234");

            // Build user session object
            const userSession = {
                name: isAdmin ? "Rushdi Mustafa" : data.user.name,
                email: email,
                role: isAdmin ? "admin" : "customer"
            };

            // Permanently save the session to LocalStorage so the home page can access it
            localStorage.setItem('userSession', JSON.stringify(userSession));

            // Display customized greeting message based on authorization level
            if (userSession.role === "admin") {
                showToast("Welcome Admin Rushdi Mustafa", "success");
            } else {
                showToast(`Welcome back, ${userSession.name}`, "success");
            }

            // Redirect the user to their designated view after 1.5 seconds
            setTimeout(() => {
                if (userSession.role === "admin") {
                    // Admin goes straight to the backend panel folder
                    window.location.href = "../Dashboard/dashboard.html"; 
                } else {
                    // Regular customers go straight to the main shop home page
                    window.location.href = "../account.html"; 
                }
            }, 1500);

        } else {
            // Backend rejected login credentials
            showToast(data.message || "Invalid credentials.", "error");
        }
    } catch (err) {
        console.error("Login Network Error:", err);
        showToast("Server error. Please try again later.", "error");
    }
};