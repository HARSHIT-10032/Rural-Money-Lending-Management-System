const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  middleName: String,
  surname: { 
    type: String, 
    required: true 
  },
  aadhaar: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{12}$/ 
  },
  mobile: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{10}$/ 
  },
  village: String,
  district: String,
  tehsil: String,
  state: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);