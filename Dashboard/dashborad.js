// --- CONFIGURATION ---
const API_URL = "https://karibu-grocaries-ltd-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get user data from LocalStorage
    const session = JSON.parse(localStorage.getItem('userSession'));

    // 2. SECURITY CHECK: Redirect to login if not logged in
    if (!session) {
        window.location.href = "/login.html";
        return;
    }

    // 3. PERSONALIZATION: Update Name and Greeting
    const greeting = document.getElementById('user-greeting');
    const welcomeTitle = document.getElementById('welcome-title');
    
    if (greeting) greeting.innerText = `Welcome, ${session.name}`;
    if (welcomeTitle) {
        welcomeTitle.innerText = session.role === 'admin' ? "Director Overview" : "Customer Dashboard";
    }

    // 4. PERMISSIONS: Hide Admin-only features from regular customers
    if (session.role !== 'admin') {
        // Find all elements with the 'admin-only' class and hide them
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            el.style.setProperty('display', 'none', 'important');
        });
        
        console.log("Customer View: Admin tools and revenue cards hidden.");
    }

    // 5. DATA: Sync with Database
    syncDashboardData();
});

// --- CORE FUNCTIONS ---

async function syncDashboardData() {
    try {
        // Fetch real products from your Railway backend
        const response = await fetch(`${API_URL}/api/products`);
        const products = await response.json();

        // Update Product Count (if the element exists)
        const prodCountEl = document.getElementById('totalProducts');
        if (prodCountEl) {
            prodCountEl.innerText = products.length || 0;
        }

        // Add logic here later for real Sales and Stock from MongoDB
        console.log("Dashboard synced with MongoDB ✅");

    } catch (err) {
        console.error("Sync Error:", err);
        // Fallback to your default static data if server fails
        console.log("Using offline dashboard data.");
    }
}

// 6. LOGOUT: Clear session and redirect
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = "/login.html";
}
