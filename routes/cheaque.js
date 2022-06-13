const express = require("express");
const router = express.Router();
const User = require("../modals/user");
const Cheaque = require("../modals/cheaque");
const Qrcodes = require("../modals/qrcodes");
const qrcode = require("qrcode");
const bcrypt = require("bcryptjs");
const cheaque = require("../modals/cheaque");
const { findOneAndUpdate } = require("../modals/user");

// validation

router.post("/generation", async function (req, res) {
  console.log(req.body);

  //checking user existance

  const usernameExist = await User.findOne({ username: req.body.username });
  console.log(usernameExist);
  if (!usernameExist) return res.status(400).send("User does'nt exists");

  var cheques = [];

  for (let i = 0; i < req.body.number; i++) {
    const cheaque = new Cheaque({
      usernameSender: req.body.username,
      usernameReciever: "",
      amount: "",
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
router.get("/generation/send/:id", async (req, res) => {
  const sender = await Qrcodes.find({ username: req.body.username })
    .sort({ _id: -1 })
    .limit(10);
  res.send(sender);
});
router.get("/issuedcheaques", async (req, res) => {
  const cheaque = await Cheaque.find({ usernameReciever: "" }).sort({
    _id: -1,
  });
  res.send(cheaque);
});
router.get("/activecheaques/:username", async (req, res) => {
  const cheaque = await Cheaque.find({
    usernameSender: req.params.username,
    status: false,
  }).sort({
    _id: -1,
  });
  res.send(cheaque);
});
router.get("/transcations/:username", async (req, res) => {
  const cheaque = await Cheaque.find({
    usernameSender: req.params.username,
    status: true,
  }).sort({ _id: -1 });
  res.send(cheaque);
});
router.get("/activecheaques", async (req, res) => {
  const cheaque = await Cheaque.find().sort({
    _id: -1,
  });
  res.send(cheaque);
});
router.get("/transcations", async (req, res) => {
  const cheaque = await Cheaque.find({ status: "true" }).sort({ _id: -1 });
  res.send(cheaque);
});
router.put("/sendcheaque", async function (req, res) {
  const cheaque = await Cheaque.findOne({ _id: req.body.id });
  if (cheaque.usernameSender != req.body.username)
    return res.status(400).send("Not a valid user");
  // if (cheaque.usernameReciever != "")
  //   return res.status(400).send("Used Cheaque");

  Cheaque.findOneAndUpdate(
    { _id: req.body.id },
    { amount: req.body.amount, usernameReciever: req.body.usernameReciever },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.send(data);
      }
    }
  );
});
router.put("/receiver", async function (req, res) {
  const cheaque = await Cheaque.findOne({ _id: req.body.id });
  if (cheaque.usernameReciever != req.body.username)
    return res.status(400).send("Not a valid user");
  if (cheaque.status) return res.status(400).send("Used Cheaque");
  const sender = await User.findOne({ username: cheaque.usernameSender });
  const receiver = await User.findOne({ username: cheaque.usernameReciever });
  User.findOneAndUpdate(
    { username: cheaque.usernameSender },
    { amount: sender.amount - cheaque.amount },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
    }
  );
  User.findOneAndUpdate(
    { username: cheaque.usernameReciever },
    { amount: receiver.amount + cheaque.amount },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      }
    }
  );
  Cheaque.findOneAndUpdate(
    { _id: req.body.id },
    { status: true },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.send(data);
      }
    }
  );
});

module.exports = router;
