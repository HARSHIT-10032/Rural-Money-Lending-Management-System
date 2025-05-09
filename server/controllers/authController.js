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

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ 
      message: "Invalid credentials" 
    });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ 
      token, 
      admin: { username: admin.username, name: admin.name, role: admin.role } 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login};