const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Looks in the same folder as server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Using the JS version that works on your PC
const nodemailer = require('nodemailer');

const app = express();

// --- DEBUGGING ---
console.log("--- STARTING KARIBU SERVER ---");
console.log("Checking MONGO_URI:", process.env.MONGO_URI ? "Found! " : "Still Undefined ❌");
console.log("------------------------------");

// Middleware
app.use(express.json());
app.use(cors());

// --- 1. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Connected to MongoDB: KGL_DB"))
    .catch(err => console.error(" Connection error:", err));

// --- 2. MODELS ---

// User Schema (For Karibu Groceries Customers)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: String
});
const User = mongoose.model('User', userSchema);

// Admin Schema (For existing admin login)
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// --- 3. EMAIL CONFIG ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'karibugroceries@gmail.com',
        // USE YOUR 16-CHARACTER GMAIL APP PASSWORD HERE
        pass: 'YOUR_GMAIL_APP_PASSWORD' 
    }
});

// --- 4. ROUTES ---

// Registration Route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Rules: 8 chars, 1 number, 1 symbol
    const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!pwRegex.test(password)) {
        return res.status(400).send("Password must be 8+ chars with a number and symbol.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(1000 + Math.random() * 9999).toString();

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            verificationCode: code 
        });
        await newUser.save();

        await transporter.sendMail({
            from: '"Karibu Groceries" <karibugroceries@gmail.com>',
            to: email,
            subject: 'Verify Your Karibu Account',
            text: `Welcome ${name}! Your verification code is: ${code}`
        });

        res.status(200).send("Verification code sent!");
    } catch (error) {
        res.status(500).send("Error: User might already exist.");
    }
});

// Verification Route
app.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email, verificationCode: code });

    if (user) {
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();
        res.status(200).send("Account verified successfully!");
    } else {
        res.status(400).send("Invalid verification code.");
    }
});

// Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (user && user.isVerified && await bcrypt.compare(password, user.password)) {
            res.json({ success: true, user: { name: user.name, role: "User" } });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials or unverified" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});


const { verifyToken } = require('./auth');

// This route is protected by the verifyToken function 
app.post('/update-profile', verifyToken, (req, res) => {
    const updatedData = req.body;
    // Specific place: Saving to the JSON folder identified in the source [1]
    const filePath = path.join(__dirname, '../JSON/users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let users = JSON.parse(data);
        // Find the user by the ID stored in the JWT
        const index = users.findIndex(u => u.id === req.user.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
                if (err) return res.status(500).send("Error saving data");
                res.send("Information updated successfully in JSON storage.");
            });
        }
    });
});
// Registration Route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save user as unverified
        await User.findOneAndUpdate(
            { email }, 
            { name, email, password: hashedPassword, verificationCode: code, isVerified: false },
            { upsert: true, new: true }
        );

        // Send Email
        await transporter.sendMail({
            from: '"Karibu Groceries" <karibugroceries@gmail.com>',
            to: email,
            subject: "Your Verification Code",
            text: `Welcome to Karibu! Your code is: ${code}`
        });

        res.status(200).send("Verification code sent.");
    } catch (err) {
        res.status(500).send("Error processing registration.");
    }
});

// Verification Route
app.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email, verificationCode: code });

    if (user) {
        user.isVerified = true;
        user.verificationCode = null; // Clear code after use
        await user.save();
        res.status(200).send("Verified successfully");
    } else {
        res.status(400).send("Invalid code.");
    }
});

const Product = require('./models/product'); // Adjust path as needed

// Route to Add a Product (Admin Page)
app.post('/api/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const newProduct = new Product({ name, price });
        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to Get All Products (Home Page)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ dateAdded: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

