const products = [
    { id: 1, name: "Fresh Tomatoes", price: 5000, category: "fresh" },
    { id: 2, name: "Local Rice 5kg", price: 25000, category: "pantry" },
    { id: 3, name: "Organic Milk", price: 3000, category: "dairy" },
];

let cart = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    displayProducts(products);
    document.getElementById('date-display').innerText = "Launch Date: January 2026";
});

// Render Products
function displayProducts(items) {
    const list = document.getElementById('product-list');
    list.innerHTML = items.map(p => `
        <div class="card">
            <h4>${p.name}</h4>
            <p>UGX ${p.price.toLocaleString()}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Logical Filter
function filterShop(cat) {
    if(cat === 'all') displayProducts(products);
    else {
        const filtered = products.filter(p => p.category === cat);
        displayProducts(filtered);
    }
}

// Cart Logic
function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    document.getElementById('cart-count').innerText = cart.length;
    alert(`${item.name} added to Karibu Basket!`);
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('cart-hidden');
}
