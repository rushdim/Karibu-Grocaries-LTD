const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB Connection error:", err));

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

// 1. Registration (Auto-Verified)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  if (!pwRegex.test(password)) {
    return res.status(400).json({ 
      message: "Password must be 8+ chars with a number and symbol." 
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or Update User - Set isVerified to true immediately
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        isVerified: true, 
      },
      { upsert: true, new: true }
    );

    console.log(`User ${email} registered successfully ✅`);
    res.status(200).json({ message: "Registration successful! You can now log in." });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// 2. Login (Includes Admin Role Check)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Admin Check: Only this specific email gets admin rights
      const isAdmin = user.email === "karibugroceries@gmail.com";
      
      res.json({
        success: true,
        user: {
          name: isAdmin ? "Rushdi Mustafa Yousif Adam" : user.name,
          email: user.email,
          role: isAdmin ? "admin" : "user",
        },
      });
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
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
