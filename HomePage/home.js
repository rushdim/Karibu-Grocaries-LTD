
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
