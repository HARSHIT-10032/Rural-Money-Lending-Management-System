const Loan = require("../models/Loan");
const User = require("../models/User");
const Payment = require("../models/Payment");

exports.createLoan = async (req, res) => {
  try {
    const {
      name,
      middleName,
      surname,
      aadhaar,
      mobile,
      village,
      district,
      tehsil,
      state,
      amount,
      interestRate,
      loanTermMonths,
      sanctionDate,
      repaymentFrequency,
      purpose,
      securityType,
      guarantorName,
      guarantorMobile,
      remarks,
      notes,
    } = req.body;

    let user = await User.findOne({ mobile });
    if (!user) {
      user = new User({
        name,
        middleName,
        surname,
        aadhaar,
        mobile,
        village,
        district,
        tehsil,
        state,
      });
      await user.save();
    }

    const loan = new Loan({
      user: user._id,
      amount: Number(amount),
      principalRemaining: Number(amount),
      interestRate: Number(interestRate),
      loanTermMonths: Number(loanTermMonths),
      sanctionDate,
      repaymentFrequency,
      purpose,
      securityType,
      guarantorName,
      guarantorMobile,
      remarks,
      notes,
      status: "Pending",
    });

    if (sanctionDate) {
      const start = new Date(sanctionDate);
      const now = new Date();

      let months =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth());

      if (now.getDate() < start.getDate()) {
        months -= 1;
      }

      if (months > 0) {
        const monthlyInterest = (Number(amount) * Number(interestRate)) / 1200;
        loan.totalInterest = monthlyInterest * months;
      }
    }

    await loan.save();

    user.loans.push(loan._id);
    await user.save();

    res.status(201).json({
      message: "Loan created successfully",
      loan,
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// Record a Payment
exports.recordPayment = async (req, res) => {
  try {
    const { loanId, amount, type, paymentMethod, date } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        error: "Loan not found",
      });
    }

    const amt = Number(amount) || 0;
    if (amt <= 0) {
      return res.status(400).json({
        error: "Invalid payment amount",
      });
    }

    if (type === "Interest") {
      if (amt > loan.totalInterest) {
        return res
          .status(400)
          .json({ error: "Amount cannot exceed outstanding interest" });
      }
      loan.totalInterest -= amt;
      loan.totalInterestPaid += amt;
    } else if (type === "Settlement") {
      // Full settlement
      loan.totalInterest = 0;
      loan.totalInterestPaid += amt;
      loan.status = "Cleared";
      loan.closeDate = date || new Date();
    }

    // Save Payment Record
    const payment = new Payment({
      loan: loan._id,
      amount: amt,
      type,
      paymentMethod,
      dateOfPayment: date || new Date(),
    });
    await payment.save();

    await loan.save();

    res.json({
      message: "Payment recorded",
      loan,
      payment,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};
