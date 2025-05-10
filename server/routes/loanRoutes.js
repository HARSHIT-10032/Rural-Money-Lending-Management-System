const express = require("express");
const router = express.Router();

const { createLoan } = require("../controllers/loanController");

// Create Loan API to create loan for user
router.post("/create", createLoan);

module.exports = router;