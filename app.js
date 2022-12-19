require("dotenv").config();
require("./config/database").connect();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const express = require("express");
const User = require("./model/user");
const app = express();
const auth = require("./middleware/auth");
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Hello from App.js  /Auth JS</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    //validation
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email }); //Promise
    if (existingUser) {
      res.status(401).send("User already exist");
    }

    const myEncPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    //token creation part
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );

    user.token = token;
    //update or not in DB
    //TODO : handle password situation
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(200).send("Field is missing");
    }
    const user = await User.findOne({ email });

    // if(!user){
    //   res.status(400).send("you are not registered in iur app")
    // }

    // const result = await bcrypt.compare(password,user.password);

    // if(!result){
    //   res.status(400).send("password incorrect")
    // }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "3h",
        }
      );

      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }

    res.send(400).send("email or password is incorrect");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.send("<h1>Welcome to secert information</h1>");
});

module.exports = app;
