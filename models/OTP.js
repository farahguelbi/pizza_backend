const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: {
    required: true,
    type: String
  },
  otp: {
    type: String,
    required: true,

  },
  expiry_date:{
    type: Date,
    required: true,

  },

}, { timestamps: true });

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;