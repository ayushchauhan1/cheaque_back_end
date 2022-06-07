const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 5000,
  },
});

module.exports = User = mongoose.model("Users", Userschema);
