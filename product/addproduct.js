document.getElementById("saveBtn").addEventListener("click", async function () {
    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const messageDiv = document.getElementById("message");

    const name = nameInput.value.trim();
    const price = priceInput.value;

    messageDiv.innerText = "";
    messageDiv.style.color = "red";

    // 1. Validation: Check if empty
    if (!name || !price) {
        messageDiv.innerText = "Error: Product details are required!";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: name, 
                price: parseFloat(price)
            }),
        });

        const result = await response.json();

        // 2. Logic: If product already exists
        if (response.status === 409) {
            messageDiv.style.color = "orange";
            messageDiv.innerHTML = `
                <p>Product "${name}" is already available!</p>
        <button onclick="window.location.href='/HomePage/index.html'" class="btn" style="background: #1b4d3e; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">
            View Product
        </button>
    `;
            return;
        }

        // 3. Logic: Successfully Added
        if (response.ok) {
            messageDiv.style.color = "green";
            messageDiv.innerHTML = `
                <p>Success: ${name} added!</p>
                <button onclick="window.location.href='/HomePage/index.html'" class="btn" style="background: var(--orange); color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">
                    View Product
                </button>
            `;
            
            // Clear inputs
            nameInput.value = "";
            priceInput.value = "";
        }
    } catch (err) {
        messageDiv.innerText = "Error: Server connection failed.";
    }
});
