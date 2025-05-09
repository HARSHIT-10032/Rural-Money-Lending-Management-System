const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

// routes
app.use("/api/auth", authRoutes);

// Start server
connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});