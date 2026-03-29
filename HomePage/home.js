/**
 * KARIBU GROCERIES - HOME PAGE LOGIC (Bootstrap Version)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load from MongoDB
    displayProducts();

    // 2. Search Logic
    const searchInput = document.getElementById('search-bar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const items = document.querySelectorAll('.product-item');
            
            items.forEach(item => {
                const nameTag = item.querySelector('h6');
                if (nameTag) {
                    const name = nameTag.textContent.toLowerCase();
                    item.style.display = name.includes(query) ? "" : "none";
                }
            });
        });
    }
});

async function displayProducts() {
    const grid = document.getElementById('productGrid');
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        // Use 'insertAdjacentHTML' with 'beforeend' to keep your manual cards
        const dynamicCards = products.map((p, index) => {
            // AUTO-IMAGE LOGIC: Generates a photo based on the name
            const query = encodeURIComponent(p.name);
            const autoImage = `https://loremflickr.com{query},vegetable,farm/all?lock=${index}`;

            return `
                <div class="product-item fade-in-card">
                    <div class="card h-100 p-2 text-center border-0 shadow-sm">
                        <img src="${autoImage}" class="produce-img mb-2" alt="${p.name}">
                        <h6>${p.name}</h6>
                        <p class="text-muted">${p.price.toLocaleString()} Ush</p>
                        <a href="/Basket/basket.html" class="btn btn-primary w-100 mt-auto">Add to Basket</a>
                        <button onclick="deleteProduct('${p._id}')" class="btn btn-link text-muted mt-1 p-0" style="font-size: 0.7rem; text-decoration: none;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        grid.insertAdjacentHTML('beforeend', dynamicCards);
    } catch (err) {
        console.error("Error:", err);
    }
}

// Function to delete product
async function deleteProduct(id) {
    if (confirm("Remove this product?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert("Product Deleted");
                location.reload(); // Reload to refresh grid
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }
}
