const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Qrcodesschema = new Schema({
  qrc: {
    type: String,
  },
});

module.exports = User = mongoose.model("Qrcodes", Qrcodesschema);
