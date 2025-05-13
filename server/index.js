const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

// Start server
connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});