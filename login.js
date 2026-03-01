function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();

    // 1. Check for empty fields
    if (!username || !password) {
        showToast("Please enter username and password.", "error");
        return;
    }

    // 2. Validate against your specific credentials
    if (username === "kgl_admin" && password === "groceries2026") {
        
        // Success logic
        showToast(`Welcome, Admin! Redirecting...`, "success");
        
        // Create a dummy user object for the session
        const user = { name: "Admin", role: "kgl_staff" };
        localStorage.setItem('currentSession', JSON.stringify(user));

        setTimeout(() => {
            window.location.href = "Dashboard/dashboard.html";
        }, 1200);

    } else {
        // Error logic
        showToast("Invalid username or password.", "error");
    }
};
