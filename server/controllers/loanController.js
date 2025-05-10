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
      interestRate: Number(interestRate),
      loanTermMonths: Number(loanTermMonths),
      sanctionDate,
      purpose,
      securityType,
      guarantorName,
      guarantorMobile,
      remarks,
      notes,
      status: "Pending",
    });
    
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