const API_URL = "https://karibu-grocaries-ltd-production.up.railway.app";

/* --- UTILS: TOAST NOTIFICATIONS --- */
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* --- LOGIC: PASSWORD TOGGLE --- */
const toggleBtn = document.querySelector('#togglePassword');
const passField = document.querySelector('#adminPass');
const eyeIcon = document.querySelector('#eyeIcon');

if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
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

    if (!email || !password) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 1. Identify if this is Rushdi (Admin)
            const isAdmin = (email === "karibugroceries@gmail.com") && (password === "Rushdi@1234");

            const userSession = {
                name: isAdmin ? "Rushdi Mustafa Yousif Adam" : data.user.name,
                email: email,
                role: isAdmin ? "admin" : "user"
            };

            // 2. Save to Memory (LocalStorage)
            localStorage.setItem('userSession', JSON.stringify(userSession));

            showToast(`Welcome, ${userSession.name}!`, "success");

            // 3. Redirect to Dashboard
            setTimeout(() => {
               if (userSession.role === "admin") {
                    // Admin goes to the Dashboard folder
                    window.location.href = "../Dashboard/dashboard.html"; 
                } else {
                    // Normal user goes to the main website home page
                    // Adjust this path if your index.html is in a different folder
                    window.location.href = "../HomePage/index.html"; 
                }
            }, 1500);


        } else {
            showToast(data.message || "Invalid credentials.", "error");
        }
    } catch (err) {
        console.error("Login Error:", err);
        showToast("Server error. Please try again later.", "error");
    }
};
