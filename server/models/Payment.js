const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  loan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Loan", 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, enum: ["Interest", "Principal", "Settlement"], 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    default: "Cash" 
  },
  dateOfPayment: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
