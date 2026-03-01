// Function to show smooth notifications
function showStatus(message, type = "success") {
    // Remove existing toast if present
    const existingToast = document.querySelector('.status-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `status-toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

const API_URL = "http://localhost:3000"; // Your Node.js Server URL

function validatePassword(pw) {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(pw);
}

async function sendVerification() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
        return showStatus("All fields are required!", "error");
    }
    if (!validatePassword(password)) {
        return showStatus("Password must be 8+ chars, with a number and symbol (!@#).", "error");
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            showStatus(`Code sent to ${email}! Check your inbox.`, "success");
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('verify-section').classList.remove('hidden');
            // Save email for verification step
            localStorage.setItem('pendingEmail', email);
        } else {
            showStatus(await response.text(), "error");
        }
    } catch (err) {
        showStatus("Server is offline. Start your node server!", "error");
    }
}

async function verifyAndSave() {
    const code = document.getElementById('verify-code').value;
    const email = localStorage.getItem('pendingEmail');

    try {
        const response = await fetch(`${API_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code })
        });

        if (response.ok) {
            showStatus("Account Verified! Redirecting to login...", "success");
            setTimeout(() => window.location.href = "/login.html", 2000);
        } else {
            showStatus("Invalid Code. Try again.", "error");
        }
    } catch (err) {
        showStatus("Connection error.", "error");
    }
}

// Logic for Login page
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            showStatus(`Welcome back, ${data.user.name}!`, "success");
            localStorage.setItem('userSession', JSON.stringify(data.user));
            // Redirect to dashboard/home
        } else {
            showStatus("Invalid email or password.", "error");
        }
    } catch (err) {
        showStatus("Server error.", "error");
    }
}
