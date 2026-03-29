// --- CONFIGURATION ---
const API_URL = "https://your-app-name.up.railway.app"; // Update this with your real URL

// --- AUTHENTICATION LOGIC ---

// 1. LOGIN FUNCTION
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) return showStatus("Please fill in all fields", "error");

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showStatus(`Welcome back, ${data.user.name}!`, "success");
            localStorage.setItem('userSession', JSON.stringify(data.user));
            
            // Redirect to your main page after a short delay
            setTimeout(() => {
                window.location.href = "index.html"; 
            }, 1500);
        } else {
            // Displays the specific error from your server.js (e.g., "Invalid credentials or unverified")
            showStatus(data.message || "Login failed", "error");
        }
    } catch (err) {
        showStatus("Server error. Please check your connection.", "error");
    }
}

// 2. REGISTRATION (SEND CODE)
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

        const message = await response.text();

        if (response.ok) {
            showStatus(`Code sent to ${email}!`, "success");
            // Switch UI views
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('verify-section').classList.remove('hidden');
            // Save email for the next step
            localStorage.setItem('pendingEmail', email);
        } else {
            showStatus(message, "error");
        }
    } catch (err) {
        showStatus("Server is offline. Check your backend status!", "error");
    }
}

// 3. VERIFY CODE & SAVE
async function verifyAndSave() {
    const code = document.getElementById('verify-code').value;
    const email = localStorage.getItem('pendingEmail');

    if (!code) return showStatus("Please enter the code.", "error");

    try {
        const response = await fetch(`${API_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }) // Fixed: sending 'code' instead of undefined 'password'
        });

        if (response.ok) {
            showStatus("Account Verified! Redirecting...", "success");
            setTimeout(() => {
                window.location.href = "login.html"; 
            }, 2000);
        } else {
            const errorMsg = await response.text();
            showStatus(errorMsg || "Invalid Code. Try again.", "error");
        }
    } catch (err) {
        showStatus("Connection error.", "error");
    }
}

// --- UTILS ---

function validatePassword(pw) {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(pw);
}

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}
// 1. Password Strength Checker
function checkStrength() {
    const password = document.getElementById('reg-password').value;
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const colors = ["#ff4d4d", "#ffa500", "#ffff00", "#2ecc71"];
    const labels = ["Weak", "Fair", "Good", "Strong"];

    if (password.length === 0) {
        bar.style.width = "0%";
        text.innerText = "";
    } else {
        bar.style.width = (strength * 25) + "%";
        bar.style.backgroundColor = colors[strength - 1] || colors[0];
        text.innerText = labels[strength - 1] || labels[0];
        text.style.color = colors[strength - 1] || colors[0];
    }
}

// 2. Modified sendVerification to check if passwords match
async function sendVerification() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!name || !email || !password) {
        return showStatus("All fields are required!", "error");
    }

    // NEW: Check if passwords match
    if (password !== confirmPassword) {
        return showStatus("Passwords do not match!", "error");
    }

    if (!validatePassword(password)) {
        return showStatus("Password is too weak!", "error");
    }

    // ... rest of your existing fetch code ...
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        // ... (as before)
    } catch (err) {
        showStatus("Server error.", "error");
    }
}

function showStatus(message, type = "success") {
    const existingToast = document.querySelector('.status-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `status-toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}
