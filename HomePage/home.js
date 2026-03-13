
    // 1. Wait for the page to load
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('search-bar');
        const noResults = document.getElementById('no-results-msg');
        const items = document.querySelectorAll('.product-item');

        // 2. Listen for typing in the search bar
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let hasMatch = false;

            // 3. Loop through every product
            items.forEach(item => {
                const name = item.querySelector('h6').textContent.toLowerCase();
                
                if (name.includes(query)) {
                    item.style.display = ""; // Show
                    hasMatch = true;
                } else {
                    item.style.display = "none"; // Hide
                }
            });

            // 4. Show/Hide the "No Results" message
            noResults.style.display = hasMatch ? "none" : "block";
        });
    });

// Example product data
const products = [
    { name: "Ring Battery Doorbell", price: "$69.99", img: "https://via.placeholder.com" },
    { name: "Ring Indoor Cam", price: "$59.99", img: "https://via.placeholder.com" },
    { name: "Ring Chime Pro", price: "$49.99", img: "https://via.placeholder.com" }
];

const productList = document.getElementById('product-list');

// Function to render products
function renderProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p class="price">${product.price}</p>
            <button class="add-btn">Add to Basket</button>
        `;
        productList.appendChild(card);
    });
}

// Initialize
renderProducts();

// Simple Search Alert
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value;
    alert("Searching for: " + query);
});

async function displayProducts() {
    const grid = document.getElementById('productGrid');
    const spinner = document.getElementById('loadingSpinner');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // 1. If not logged in, ensure spinner is hidden and stop
    if (!isLoggedIn) {
        if (spinner) spinner.style.display = 'none';
        grid.innerHTML = '<p class="text-center w-100">Please login to view products.</p>';
        return;
    }

    // 2. If logged in, show spinner while fetching
    if (spinner) spinner.style.display = 'block';

    try {
        const response = await fetch('https://your-railway-app-name.up.railway.app/products');
        
        const products = await response.json();

        // 3. Hide spinner once data arrives
        if (spinner) spinner.style.display = 'none';
        grid.innerHTML = ""; 

        if (products.length === 0) {
            grid.innerHTML = '<p class="text-center w-100">No products found.</p>';
            return;
        }

        grid.innerHTML = products.map(p => `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body text-center">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="text-warning fw-bold">Ksh ${p.price}</p>
                        <button class="btn btn-dark w-100 rounded-pill">Add to Basket</button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        // Hide spinner even if there is an error
        if (spinner) spinner.style.display = 'none';
        grid.innerHTML = '<p class="text-danger text-center w-100">Error loading products.</p>';
    }
}

