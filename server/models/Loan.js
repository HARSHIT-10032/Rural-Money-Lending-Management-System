const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  interestRate: { 
    type: Number, 
    required: true 
  },
  loanTermMonths: { 
    type: Number, 
  },
  sanctionDate: { 
    type: Date, 
    default: Date.now 
  },
  principalRemaining: { 
    type: Number, 
    required: true 
  },
  totalInterestPaid: { 
    type: Number, 
    default: 0 
  },
  totalInterest: { 
    type: Number, 
    default: 0 
  },
  totalAmountPaid: { 
    type: Number, 
    default: 0 
  },
  status: {
    type: String,
    enum: ["Pending", "Cleared", "Due Soon", "Revised"],
    default: "Pending",
  },
  closeDate: { 
    type: Date 
  },
  remarks: String,
  payments: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Payment" 
    }],
});

module.exports = mongoose.model("Loan", loanSchema);
