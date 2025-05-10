const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(errorHandler);

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");

// routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/users", userRoutes);

// Start server
connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});