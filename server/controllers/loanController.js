const Loan = require("../models/Loan");
const User = require("../models/User");


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
      user 
    });

  } catch (err) {
    res.status(400).json({ 
      message: err.message 
    });
  }
};