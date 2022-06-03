const express = require("express");
const router = express.Router();
const User = require("../modals/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// validation

router.post("/register", async function (req, res) {
  console.log(req.body);

  //checking user existance
  const accountNumberExist = await User.findOne({
    accountNumber: req.body.accountNumber,
  });
  if (accountNumberExist) return res.status(400).send("Account already exists");

  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("Username already exists");

  // Hash Password

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // creating User
  const user = new User({
    name: req.body.name,
    accountNumber: req.body.accountNumber,
    password: hashPassword,
    bankName: req.body.bankName,
    ifscCode: req.body.ifscCode,
    phoneNumber: req.body.phoneNumber,
    username: req.body.username,
  });
  console.log(user);

  res.status(201).json(user);
  try {
    const savedUser = await user.save();
    console.log(savedUser);
    res.send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

// login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("username is wrong");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign(user.toJSON(), jwtSecretKey);

  res.send(token);

  // res.send("Logged In");
});

module.exports = router;
