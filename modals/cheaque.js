const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Cheaqueschema = new Schema({
  usernameSender: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
  },
  usernameReciever: {
    type: String,
  },
});

module.exports = User = mongoose.model("Cheaque", Cheaqueschema);
