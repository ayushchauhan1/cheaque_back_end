const express = require("express");
const router = express.Router();
const User = require("../modals/user");
const Cheaque = require("../modals/cheaque");
const Qrcodes = require("../modals/qrcodes");
const qrcode = require("qrcode");
const bcrypt = require("bcryptjs");
const cheaque = require("../modals/cheaque");

// validation

router.post("/generation", async function (req, res) {
  console.log(req.body);

  //checking user existance

  const usernameExist = await User.findOne({ username: req.body.username });
  if (!usernameExist) return res.status(400).send("User does'nt exists");

  var cheques = [];

  for (let i = 0; i < req.body.number; i++) {
    const cheaque = new Cheaque({
      usernameSender: req.body.username,
    });
    cheques.push(cheaque);
  }

  try {
    const savedCheaque = await Cheaque.insertMany(cheques);
    console.log(savedCheaque);
    res.send(savedCheaque);
    const Qrid = await Cheaque.find().sort({ _id: -1 }).limit(req.body.number);
    console.log(Qrid);

    for (let j = 0; j < req.body.number; j++) {
      qrcode.toDataURL(Qrid[j]._id.toString(), async (err, src) => {
        const qrstore = new Qrcodes({
          qrc: src,
        });

        try {
          const saveqr = await qrstore.save();
          console.log(saveqr);
        } catch (err) {
          console.log(err);
          res.status(400).json({ err: err });
        }
        if (err) res.send("Something went wrong!!");
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});
router.post("/sender", async function (req, res) {});

module.exports = router;
