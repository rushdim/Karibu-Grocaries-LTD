const express = require('express');
const app = express();

app.use(express.json());
app.get|("customers", (req, res) => {
    res.json({ message: "Customer endpoint is working!" });
     const mongoose = require('mongoose');

     mongoose.connect('mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject')
         
        .then(() => {
            console.log('Connected to MongoDB');
        })  .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
        // mongodb+srv://rushdim:<db_password>@kglproject.ycxdniv.mongodb.net/?appName=KGLproject




        document.getElementById('registerBtn').addEventListener('click', function () {
            // 1. Get input values
            const name = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            const messageDiv = document.getElementById('customerMessage');

            // 2. Clear previous messages
            messageDiv.innerText = "";
            messageDiv.style.color = "red";

            // 3. Validation Logic
            if (name === "") {
                messageDiv.innerText = "Error: Full Name is required.";
                return;
            }

            // Regex for exactly 10 digits (common for phone validation)
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone)) {
                messageDiv.innerText = "Error: Please enter a valid 10-digit phone number.";
                return;
            }

            // 4. Success Logic
            messageDiv.style.color = "green";
            messageDiv.innerText = "Success: Customer '" + name + "' has been registered!";

            // Clear inputs after successful registration
            document.getElementById('customerName').value = "";
            document.getElementById('customerPhone').value = "";
        });
    

    
