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
