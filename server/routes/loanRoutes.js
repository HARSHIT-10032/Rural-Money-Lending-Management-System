const express = require("express");
const router = express.Router();

const { createLoan } = require("../controllers/loanController");
const { getAllLoans } = require("../controllers/fetchLoanController");

// Create Loan API to create loan for user
router.post("/create", createLoan);

// == All loans Dashboard API
router.get("/", getAllLoans);

module.exports = router;