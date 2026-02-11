const mongoose = require('mongoose');

// Define the Schema (The Blueprint)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // URL for the product image
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Compile the Schema into a Model and export it
module.exports = mongoose.model('Product', productSchema);
