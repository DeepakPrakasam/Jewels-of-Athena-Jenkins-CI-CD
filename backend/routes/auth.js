const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("../db/mongoClient");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, mobile, password, adminKey } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 Secret admin key to create admins
    const role = adminKey === process.env.ADMIN_SECRET ? "admin" : "user";

    const newUser = { name, email, mobile, password: hashedPassword, role };
    await users.insertOne(newUser);

    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log("Checking if user exists...");  // Log step
  
      const db = await connectDB();
      const users = db.collection("users");
  
      const user = await users.findOne({ email });
      if (!user) {
        console.log("User not found"); // Log if user doesn't exist
        return res.status(400).json({ message: "User not found" });
      }
  
      console.log("Comparing password...");  // Log step
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log("Invalid password"); // Log if password is incorrect
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      console.log("Generating JWT token...");  // Log step
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
  
      console.log("Login successful!");  // Log step
      res.status(200).json({ message: "Login successful", token });
  
    } catch (err) {
      console.error("🔥 Login error:", err);  // Log detailed error
      res.status(500).json({ message: "Login failed", error: err.message });
    }
  });

  const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Test route - only accessible to admin
router.get("/admin/secret", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({ message: "🎉 Welcome Admin! You have access." });
});

// Test route - accessible to all logged in users
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user.email}, your role is ${req.user.role}` });
});

  
module.exports = router;
