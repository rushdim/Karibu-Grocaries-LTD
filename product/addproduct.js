   // mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject


        document.getElementById('saveBtn').addEventListener('click', function () {
                // Get input values
                const name = document.getElementById('productName').value.trim();
                const price = document.getElementById('productPrice').value;
                const messageDiv = document.getElementById('message');

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
                document.getElementById('productName').value = "";
                document.getElementById('productPrice').value = "";
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
                        errors: errors
                    };
                },

                // Business Rule: Handle the submission
                handleProductSubmit: function (event) {
                    event.preventDefault(); // Prevent page refresh

                    // Grabbing values from your specific form IDs
                    const name = document.getElementById('productName').value;
                    const price = document.getElementById('productPrice').value;
                    const stock = document.getElementById('productStock').value;
                    const category = document.getElementById('productCategory').value;

                    const validation = this.validateNewProduct(name, price, stock, category);

                    if (validation.isValid) {
                        // Logic: Format data for storage
                        const productData = {
                            name: name.trim(),
                            price: parseFloat(price).toFixed(2),
                            stock: parseInt(stock),
                            category: category,
                            dateAdded: new Date().toISOString()
                        };

                        console.log("Success: Product ready for database:", productData);
                        alert("Product added successfully to Karibu Groceries!");

                        // Clear form after success
                        document.querySelector('form').reset();
                    } else {
                        // Logic: Professional error feedback
                        alert("Entry Refused:\n- " + validation.errors.join("\n- "));
                    }
                }
            };

            // Attach logic to your form
            document.addEventListener('DOMContentLoaded', () => {
                const form = document.querySelector('form');
                if (form) {
                    form.addEventListener('submit', (e) => InventoryManager.handleProductSubmit(e));
                }
            });

       