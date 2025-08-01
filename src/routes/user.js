const { user } = require("../models/user.js");
const bcrypt = require("bcrypt");
const { validatesignup } = require("../utils/validation.js");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const express = require("express");
const userRouter = express.Router();

//API for signup or adding a new user
userRouter.post("/signup", async (req, res) => {
  try {
    validatesignup(req); //validating the input data
    const { firstName, lastName, email, password } = req.body;
    const hashed_password = await bcrypt.hash(password, 10); //encrypting the data

    const User = new user({
      firstName,
      lastName,
      email,
      password: hashed_password,
    });

    await User.save();

    //Sending the JWT
    const token = await jwt.sign({ _id: User._id }, "DevTinder@4321", {
      expiresIn: "7d",
    });
    res.cookie("token", token);

    res.status(201).json({
      message: "User created",
      data: User,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(400).send(error.message);
  }
});

//API for login using email and password
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid email ID.");
    }

    // Check if user exists
    const person = await user.findOne({ email });
    if (!person) {
      throw new Error("Invalid credentials.");
    }

    // Compare password
    const isValid = await person.validatepassword(password); //schema method

    if (!isValid) {
      return res.status(401).send("Invalid password");
    }

    //Sending the JWT
    const token = await jwt.sign({ _id: person._id }, "DevTinder@4321", {
      expiresIn: "7d",
    });
    res.cookie("token", token);

    // Success response
    res.send(person);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).send(error.message);
  }
});

//API for logout
userRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User logged out succesfully...");
});

module.exports = userRouter;
