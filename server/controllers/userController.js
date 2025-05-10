const User = require("../models/User");

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { 
    next(err); 
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("loans");
    res.json(users);
  } catch (err) { 
    next(err); 
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("loans");
    if (!user) return res.status(404).json({ 
      message: "User not found" 
    });
    res.json(user);
  } catch (err) { 
    next(err); 
  }
};
