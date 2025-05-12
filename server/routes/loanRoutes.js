const express = require("express");
const router = express.Router();

const { createLoan } = require("../controllers/loanController");
const { 
    getAllLoans,
    getPendingLoans,
    getClearedLoans,
    getClearedLoanById,
    getLoansByStatus,
    getLoanById,
} = require("../controllers/fetchLoanController");

// Create Loan API to create loan for user
router.post("/create", createLoan);

// == All loans Dashboard API
router.get("/", getAllLoans);

// == MANAGE INTEREST API
router.get("/pending", getPendingLoans);
// == Cleared loans API
router.get("/cleared", getClearedLoans);
// loanRoutes.js
router.get("/cleared/:id", getClearedLoanById);

// Get Loans by Status
router.get("/status/:status", getLoansByStatus);
// Get Loan by ID
router.get("/:id", getLoanById);



module.exports = router;