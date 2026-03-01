// mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject


     document.getElementById('procurementForm').addEventListener('submit', function (event) {
            // Prevent the actual form submission
            event.preventDefault();

            // 1. Get input values
            const produce = document.getElementById('produceName').value;
            const tonnage = document.getElementById('tonnage').value;
            const cost = document.getElementById('cost').value;
            const dealer = document.getElementById('dealerName').value.trim();
            const statusDiv = document.getElementById('statusMessage');

            // 2. Setup styles and reset
            statusDiv.style.display = "block";
            statusDiv.style.color = "white";
            statusDiv.style.backgroundColor = "red"; // Default to error color

            // 3. Validation Logic
            if (!produce || !tonnage || !cost || dealer === "") {
                statusDiv.innerText = "Error: All fields are required.";
                return;
            }

            if (parseFloat(tonnage) < 1000) {
                statusDiv.innerText = "Error: Tonnage must be at least 1000kg.";
                return;
            }

            if (cost.length < 5) {
                statusDiv.innerText = "Error: Cost must be at least 5 digits (e.g., 10,000).";
                return;
            }

            // 4. Success Logic
            statusDiv.style.backgroundColor = "green";
            statusDiv.innerText = `Success: Procurement for ${tonnage}kg of ${produce} from ${dealer} recorded!`;

            // Clear form after success
            this.reset();
        });



       
