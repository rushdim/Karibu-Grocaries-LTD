// // Function to switch between views
// function showPage(pageId) {
//     // Hide all pages
//     document.querySelectorAll('.page-container').forEach(page => {
//         page.classList.add('hidden');
//     });
//     // Show the selected page
//     document.getElementById(pageId).classList.remove('hidden');
// }

// // Function to handle logout
// function handleLogout() {
//     if (confirm("Are you sure you want to logout?")) {
//         // In a real app, clear sessions/tokens here
//         alert("Logging out...");
//         window.location.reload(); // Redirects to start (or your login page)
//     }
// }

// // Handle Language Change
// document.getElementById('language-select').addEventListener('change', (e) => {
//     alert("Language changed to: " + e.target.value);
// });
// Function to switch between pages
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-container').forEach(page => {
        page.classList.add('hidden');
    });
    // Show requested page
    document.getElementById(pageId).classList.remove('hidden');
}

// Function to handle Logout
function handleLogout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        // Clear session data if any (example)
        localStorage.removeItem('isAdminLoggedIn');
        
        // Redirect to admin login page
        // Ensure you have a file named 'admin_login.html'
        window.location.href = "admin_login.html"; 
    }
}

// Function to toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Function to save settings and show success
function saveSettings() {
    const feedback = document.getElementById('settings-feedback');
    const username = document.getElementById('admin-username').value;

    if (username.trim() === "") {
        feedback.style.color = "red";
        feedback.innerText = "Error: Username cannot be empty.";
    } else {
        feedback.style.color = "green";
        feedback.innerText = "Success: Settings updated for 2026!";
        
        // In a real app, you'd send 'username' to a server here
        console.log("Settings Saved:", {
            username: username,
            lang: document.getElementById('language-select').value
        });
    }
}

// Load theme on page start
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('dark-mode-toggle').checked = true;
    }
};
