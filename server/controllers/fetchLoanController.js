const Loan = require("../models/Loan");
const User = require("../models/User");
const Payment = require("../models/Payment");

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

// ALL Cleared loans API
exports.getClearedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "Cleared" })
      .populate("user");

    res.json(loans);
  } catch (err) {
    console.error("Error fetching cleared loans:", err);
    res.status(500).json({ error: err.message });
  }
};

// Settled loan API {CLEARED LOAN}
exports.getClearedLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate(
      "user",
      "name aadhaar surname mobile village district tehsil state"
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "Cleared") {
      return res.status(400).json({ message: "Loan is not cleared" });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Loans by Status
exports.getLoansByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const loans = await Loan.find({ status })
      .populate("user")
      .populate("payments");
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate("user");

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.json(loan);
  } catch (err) {
    console.error("Error fetching loan:", err);
    res.status(500).json({ error: err.message });
  }
};