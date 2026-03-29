const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '.env') });

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

const Product = require('./models/product'); 

// --- EMAIL CONFIG ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'karibugroceries@gmail.com',
        pass: process.env.EMAIL_PASS // Use App Password from .env
    }
});

// --- AUTH ROUTES ---

// Registration
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    if (!pwRegex.test(password)) {
        return res.status(400).json({ message: "Password must be 8+ chars with a number and symbol." });
    }

    try {
        // PREVENT OVERWRITING VERIFIED USERS
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: "Email already registered. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(1000 + Math.random() * 9000).toString();

        await User.findOneAndUpdate(
            { email }, 
            { name, email, password: hashedPassword, verificationCode: code, isVerified: false },
            { upsert: true, new: true }
        );

        await transporter.sendMail({
            from: '"Karibu Groceries" <karibugroceries@gmail.com>',
            to: email,
            subject: 'Verify Your Karibu Account',
            text: `Welcome ${name}! Your verification code is: ${code}`
        });

        res.status(200).json({ message: "Verification code sent!" });
    } catch (error) {
        console.error("Reg Error:", error);
        res.status(500).json({ message: "Error processing registration." });
    }
});

// Verification
app.post('/verify', async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({ email, verificationCode: code });

        if (user) {
            user.isVerified = true;
            user.verificationCode = null;
            await user.save();
            res.status(200).json({ message: "Account verified successfully!" });
        } else {
            res.status(400).json({ message: "Invalid or expired verification code." });
        }
    } catch (err) {
        res.status(500).json({ message: "Verification error." });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: "Please verify your email first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json({ success: true, user: { name: user.name, email: user.email, role: "User" } });
        } else {
            res.status(401).json({ success: false, message: "Invalid password." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// --- PRODUCT ROUTES ---

app.post('/api/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const existing = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) return res.status(409).json({ message: "Product already exists" });

        const newProduct = new Product({ name, price });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send("<h1>Karibu Groceries Backend is Live!</h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
