const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const connectDB = require("../db/mongoClient");

const router = express.Router();

// Add Product for Admin
router.post("/add-product", verifyToken, isAdmin, async (req, res) => {
  const {
    title,
    category,
    metalPurity,
    weight,
    description,
    price,
    image,
    subcategory,  // Optional subcategory for products like Bangles, Earrings, etc.
  } = req.body;

  // Validation (basic example)
  if (!title || !category || !metalPurity || !weight || !description || !price || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = await connectDB();
    const products = db.collection("products");

    // Inserting the product into the database
    await products.insertOne({
      title,
      category,
      metalPurity,
      weight,
      description,
      price,
      image,
      subcategory: subcategory || null, // If subcategory is provided, insert it; otherwise, set as null
      createdAt: new Date(), // Optionally, store creation timestamp
    });

    res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
});


// Get all orders
router.get("/orders", verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const orders = await db.collection("orders").find().toArray();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get all users
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
