const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../db/mongoClient");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Add product to cart
router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    const db = await connectDB();
    const carts = db.collection("carts");

    const existing = await carts.findOne({ userId, productId });

    if (existing) {
      await carts.updateOne(
        { userId, productId },
        { $inc: { quantity } }
      );
    } else {
      await carts.insertOne({ userId, productId, quantity });
    }

    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
});

// Get user cart
router.get("/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  if (req.user.id !== userId) {
    return res.status(403).json({ message: "Unauthorized access to cart" });
  }

  try {
    const db = await connectDB();
    const carts = db.collection("carts");
    const products = db.collection("products");

    const cartItems = await carts.find({ userId }).toArray();
    const detailedCart = await Promise.all(cartItems.map(async (item) => {
      const product = await products.findOne({ _id: new ObjectId(item.productId) });
      return {
        ...item,
        product
      };
    }));

    res.json(detailedCart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
});

// Remove item from cart
router.delete("/remove", verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const db = await connectDB();
    const carts = db.collection("carts");

    await carts.deleteOne({ userId, productId });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
});

module.exports = router;
