// Function to switch between views
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-container').forEach(page => {
        page.classList.add('hidden');
    });
    // Show the selected page
    document.getElementById(pageId).classList.remove('hidden');
}

// Function to handle logout
function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        // In a real app, clear sessions/tokens here
        alert("Logging out...");
        window.location.reload(); // Redirects to start (or your login page)
    }
}

// Handle Language Change
document.getElementById('language-select').addEventListener('change', (e) => {
    alert("Language changed to: " + e.target.value);
});
