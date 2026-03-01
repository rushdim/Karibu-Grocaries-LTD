const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware and MongoDB connection [1]
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/karibuDB');

// User Schema with verification logic [1]
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false } // Logic to verify the account [1]
});

const User = mongoose.model('User', userSchema);

// Registration: Redirects to verification after adding details [1]
app.post('/register', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    // Perform account verification [1]
    res.send("Details added. Please verify your account to access the dashboard.");
});

// Login: Redirects to dashboard or registration if account is missing [1]
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        res.redirect('/dashboard'); // Take to dashboard after login [1]
    } else {
        res.redirect('/register'); // Redirect to account creation if no account exists [1]
    }
});

app.listen(3000, () => console.log('Karibu server running on port 3000'));