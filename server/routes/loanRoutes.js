const express = require("express");
const router = express.Router();

const { createLoan } = require("../controllers/loanController");
const { 
    getAllLoans,
    getPendingLoans,
    getClearedLoans,
} = require("../controllers/fetchLoanController");

// Create Loan API to create loan for user
router.post("/create", createLoan);

// == MANAGE INTEREST API
router.get("/pending", getPendingLoans);
// == Cleared loans API
router.get("/cleared", getClearedLoans);

// == All loans Dashboard API
router.get("/", getAllLoans);

module.exports = router;