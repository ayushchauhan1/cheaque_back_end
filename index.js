require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyparser = require("body-parser");
const login = require("./routes/login");
const cheaque = require("./routes/cheaque");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

// Routes
app.use("/login", login);
app.use("/cheaque", cheaque);

app.listen(5000);
