// mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject

document.getElementById("saveBtn").addEventListener("click", function () {
  // Get input values
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value;
  const messageDiv = document.getElementById("message");

  // Reset message style
  messageDiv.style.color = "red";
  messageDiv.innerText = "";

  // 1. Validation Logic
  if (name === "") {
    messageDiv.innerText = "Error: Product name is required.";
    return;
  }

  if (price === "" || parseFloat(price) <= 0) {
    messageDiv.innerText = "Error: Please enter a valid price greater than 0.";
    return;
  }

  // 2. Success Logic
  messageDiv.style.color = "green";
  messageDiv.innerText = "Success: Product '" + name + "' has been added!";

  // 3. Optional: Clear inputs after success
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
});

/**
 * KARIBU GROCERIES - ADMIN BUSINESS LOGIC
 * Professional validation for adding new inventory
 */
const InventoryManager = {
  // Business Rule: Ensure product data is valid before "saving"
  validateNewProduct: function (name, price, stock, category) {
    const errors = [];

    if (name.trim().length < 2) errors.push("Product name is too short.");

    // Logic: Price cannot be free or negative
    if (parseFloat(price) <= 0) errors.push("Price must be a positive value.");

    // Logic: Stock must be a whole number and at least 1
    if (!Number.isInteger(parseInt(stock)) || parseInt(stock) < 1) {
      errors.push("Initial stock must be at least 1 unit.");
    }

    if (category === "Select Category" || !category) {
      errors.push("Please select a valid category.");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },

  // Business Rule: Handle the submission
  handleProductSubmit: function (event) {
    event.preventDefault(); // Prevent page refresh

    // Grabbing values from your specific form IDs
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const stock = document.getElementById("productStock").value;
    const category = document.getElementById("productCategory").value;

    const validation = this.validateNewProduct(name, price, stock, category);

    if (validation.isValid) {
      // Logic: Format data for storage
      const productData = {
        name: name.trim(),
        price: parseFloat(price).toFixed(2),
        stock: parseInt(stock),
        category: category,
        dateAdded: new Date().toISOString(),
      };

      console.log("Success: Product ready for database:", productData);
      alert("Product added successfully to Karibu Groceries!");

      // Clear form after success
      document.querySelector("form").reset();
    } else {
      // Logic: Professional error feedback
      alert("Entry Refused:\n- " + validation.errors.join("\n- "));
    }
  },
};

// Attach logic to your form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) =>
      InventoryManager.handleProductSubmit(e)
    );
  }
});
    document.getElementById("saveBtn").addEventListener("click", async function () {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value;

  if (!name || !price) return alert("Please fill all fields");

  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price: parseFloat(price) }),
  });

  if (response.ok) {
    alert("Product saved to MongoDB!");
    location.reload(); // Refresh to clear
  }
});
document.getElementById("saveBtn").addEventListener("click", async function () {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value;

  if (!name || !price) return alert("Please fill all fields");

  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price: parseFloat(price) }),
  });

  if (response.ok) {
    alert("Product saved to MongoDB!");
    location.reload(); // Refresh to clear
  }
});


async function displayProducts() {
    const grid = document.getElementById('productGrid');
    
    try {
        // 1. Fetch data from your backend
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const products = await response.json();

        // 2. Clear the "Loading products..." message immediately
        grid.innerHTML = ""; 

        // 3. Handle Empty State
        if (products.length === 0) {
            grid.innerHTML = '<p class="text-muted">No products available. Add some from the admin page!</p>';
            return;
        }

        // 4. Inject Products
        grid.innerHTML = products.map(p => `
            <div class="col">
                <div class="card h-100 product-card">
                    <div class="card-body">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-price">Ksh ${p.price}</p>
                        <button class="btn btn-warning w-100">Add to Basket</button>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (err) {
        console.error("Fetch error:", err);
        grid.innerHTML = '<p class="text-danger">Error: Could not connect to the server.</p>';
    }
}


// Inside your login success logic:
if (response.ok) {
    const data = await response.json();
    localStorage.setItem('isLoggedIn', 'true'); // Set the flag
    localStorage.setItem('token', data.token); // Save your JWT token
    window.location.href = '/HomePage/hom.html'; // Redirect to home
}
