require('dotenv').config(); // MUST be at the top to read your .env file
const jwt = require('jsonwebtoken');

// Now SECRET_KEY will correctly pull the value from your .env
const SECRET_KEY = process.env.JWT_SECRET; 

// ... rest of  generateToken and verifyToken functions

// 2. Generate Token: Use this when a user logs in successfully
function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
}

// 3. Verify Token: Use this as middleware to protect specific routes
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Access denied. No token provided.");

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next(); // Permission granted to proceed
    } catch (err) {
        res.status(401).send("Invalid or expired token.");
    }
}

module.exports = { generateToken, verifyToken };