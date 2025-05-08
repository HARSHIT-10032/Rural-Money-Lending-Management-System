const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res, next) {
  try {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username+password required" });
    }

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ 
      message: "Admin already exists" 
    });

    const hash = await bcrypt.hash(password, 10);

    const admin = new Admin({ username, passwordHash: hash, name });
    await admin.save();

    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    next(err);
  }
}

module.exports = { register};