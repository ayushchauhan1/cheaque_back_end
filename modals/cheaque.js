const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Cheaqueschema = new Schema({
  usernameSender: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  usernameReciever: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = User = mongoose.model("Cheaque", Cheaqueschema);
