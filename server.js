


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// --- MIDDLEWARE ---



// ADD THIS LINE:
 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname));
// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => {
    console.error("CRITICAL CONNECTION ERROR ❌:", err.message);
    // This will tell us if it's an "Authentication Failed" or "Connection Timeout"
  });


// --- MODELS ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true }, // Default to true to skip verification
});
const User = mongoose.model("User", userSchema);

const Product = require("./models/product");

// --- AUTH ROUTES ---
// --- AUTH ROUTES ---

// 1. Registration (Change this path from /api/login to /api/register)
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;
    const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    if (!pwRegex.test(password)) {
        return res.status(400).json({ message: "Password must be 8+ chars with a number and symbol." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { name, email: email.toLowerCase(), password: hashedPassword, isVerified: true },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "Registration successful! You can now log in." });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// 2. Login (Keep this as /api/login)
app.post("/api/login", (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Example login check
        if (email === "karibugroceries@gmail.com" && password === "Rushdi@1234") {
            return res.status(200).json({
                message: "Login successful",
                user: {
                    name: "Rushdi Mustafa Yousif Adam",
                    email: email
                }
            });
        }

        // Invalid login
        return res.status(401).json({ message: "Invalid credentials" });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


// --- PRODUCT ROUTES ---
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SERVER STATUS ---
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
