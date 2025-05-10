const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(errorHandler);

const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");

// routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);

// Start server
connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});