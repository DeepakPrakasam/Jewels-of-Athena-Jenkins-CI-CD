const express = require("express");
const multer = require("multer");
const connectDB = require("../db/mongoClient"); 
const router = express.Router(); 
const path = require("path");
const fs = require("fs");

const { ObjectId } = require("mongodb"); // Make sure this is at the top

// GET all products
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });


// Use multer for file upload
router.put("/:id", upload.single("image"), async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
  
    if (req.file) {
      updatedProduct.image = req.file.path;  // Save image path in the database
    }
  
    try {
      const db = await connectDB();
      const result = await db.collection("products").updateOne(
        { _id: new ObjectId(productId) }, 
        { $set: updatedProduct }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "Product updated successfully" });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Error updating product", error: err.message });
    }
  });

  // In your backend route (Express.js)
    //router.get("/:id", async (req, res) => {
    //const productId = req.params.id;
    //try {
      //const db = await connectDB();
      //const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
  
     // if (!product) {
      //  return res.status(404).json({ message: "Product not found" });
     // }
  
      //res.status(200).json(product); // Return the found product
   // } catch (err) {
    //  console.error("Error fetching product:", err);
      //res.status(500).json({ message: "Error fetching product", error: err.message });
   // }
  //});

  // GET a single product by ID
router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

  

module.exports = router;
