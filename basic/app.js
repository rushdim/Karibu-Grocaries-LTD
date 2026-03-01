document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    const authSection = document.getElementById('auth-section');
    const dashboardMenu = document.getElementById('dashboard-menu');

    // 1. Check Login Status [6]
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // 2. Show Dashboard Icon if logged in [2]
        authSection.innerHTML = `
            <div class="user-icon" id="user-dashboard-trigger">
                <i data-lucide="user"></i>
            </div>
        `;
        lucide.createIcons();

        // Toggle Dashboard Dropdown
        document.getElementById('user-dashboard-trigger').addEventListener('click', () => {
            dashboardMenu.classList.toggle('hidden');
        });
    } else {
        // 3. Show Login Button if not logged in [6]
        authSection.innerHTML = `<button class="login-btn" onclick="window.location.href='login.html'">Login</button>`;
    }
});

// 4. Logout Logic: Clear session and redirect [7]
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}