const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB ✅"))
    .catch(err => console.error("MongoDB Connection error:", err));

// --- MODELS ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: String
});
const User = mongoose.model('User', userSchema);

// Ensure the product model exists in your folder structure
const Product = require('./models/product'); 

// --- AUTH ROUTES ---

// 1. Registration (Using Brevo API)
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    if (!pwRegex.test(password)) {
        return res.status(400).json({ message: "Password must be 8+ chars with a number and symbol." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        // Save/Update User in MongoDB
        await User.findOneAndUpdate(
            { email: email.toLowerCase() }, 
            { name, email: email.toLowerCase(), password: hashedPassword, verificationCode: code, isVerified: false },
            { upsert: true, new: true }
        );

        // Send Email via Brevo API
     const response = await fetch('https://brevo.com', {

            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Karibu Groceries LTD", email: "karibugroceries@gmail.com" },
                to: [{ email: email, name: name }],
                subject: "Verify Your Karibu Account",
                htmlContent: `
                    <div style="font-family: Arial; border: 1px solid #eee; padding: 20px; border-radius: 10px; max-width: 500px;">
                        <h2 style="color: #2ecc71;">Welcome to Karibu Groceries Online Marketing!</h2>
                        <p>Hello <strong>${name}</strong>,</p>
                        <p>Your verification code is:</p>
                        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
                            ${code}
                        </div>
                        <p style="margin-top: 20px;">Enter this code on the website to activate your account.</p>
                    </div>
                `
            })
        });

        if (response.ok) {
            console.log(`Verification code ${code} sent to ${email} ✅`);
            res.status(200).json({ message: "Verification code sent! Check your inbox." });
        } else {
            const errorBody = await response.text();
            console.error("Brevo API Error:", errorBody);
            res.status(500).json({ message: "User saved, but email failed to send." });
        }

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// 2. Verification
app.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase(), verificationCode: code });
        if (user) {
            user.isVerified = true;
            user.verificationCode = null;
            await user.save();
            res.status(200).json({ success: true, message: "Verified! You can now log in." });
        } else {
            res.status(400).json({ message: "Invalid or expired code." });
        }
    } catch (err) {
        res.status(500).json({ message: "Verification error." });
    }
});

// 3. Login (Includes Admin Role Check)
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user || !user.isVerified) {
            return res.status(401).json({ message: "User not found or not verified." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Define Admin Status
            const isAdmin = (user.email === "karibugroceries@gmail.com");
            
            res.json({ 
                success: true, 
                user: { 
                    name: isAdmin ? "Rushdi Mustafa Yousif Adam" : user.name, 
                    email: user.email,
                    role: isAdmin ? "admin" : "user"
                } 
            });
        } else {
            res.status(401).json({ message: "Invalid password." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SERVER STATUS ---
app.get('/', (req, res) => res.send("Karibu Groceries API is Running... 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
