const Loan = require("../models/Loan");
const User = require("../models/User");

//  API for Dashboard
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user");
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};