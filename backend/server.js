const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");  // Add this line
const authRoutes = require("./routes/auth");
const connectDB = require("./db/mongoClient");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());  // Use this middleware to parse JSON requests

// Routes
app.use("/api/auth", authRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const productRoutes = require("./routes/products");  
app.use("/api/products", productRoutes)

const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);  // ✅ Enables /api/cart/add etc.
;             



// Base route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.get("/api/categories", (req, res) => {
  res.json([
    { title: "Bangles", image: "/bangles-cat.jpg" },
    { title: "Bracelets", image: "/bracelets-cat.webp" },
    { title: "Chains", image: "/chains-cat.webp" },
    { title: "Earrings", image: "/earrings-cat.webp" },
    { title: "Mangalsutra", image: "/mangalsutra-cat.jpg" },
    { title: "Pendants", image: "/pendants-cat.webp" },
    { title: "Rings", image: "/rings-cat.jpg" },
    { title: "Bangles", image: "/bangles-cat.jpg" },

  ]);
});

app.use(express.static("../frontend/public"));
app.use("/uploads", express.static("uploads"));

// Connect to DB first, then start the server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});
