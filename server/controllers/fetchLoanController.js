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

// Manage Interest API
exports.getPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      status: { $ne: "Cleared" },
      totalInterest: { $gt: 0 }
    }).populate(
      "user",
      "name surname mobile village district tehsil state"
    );

    console.log(" Pending Loans Count:", loans.length);

    return res.status(200).json(loans);
  } catch (err) {
    console.error("❌ getPendingLoans error:", err);
    return res.status(500).json({ message: err.message });
  }
};