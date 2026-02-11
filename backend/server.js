

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // This is the line that reads your .env file

const app = express();

// The connection logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to Local MongoDB: Karibu"))
  .catch((err) => console.error("❌ Local connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

