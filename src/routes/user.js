const { user } = require("../models/user.js");
const bcrypt = require("bcrypt");
const { validatesignup } = require("../utils/validation.js");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const express = require("express");
const userRouter = express.Router();

//API for adding a new user
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
    res.send("User added successfully...");
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
    const token = await jwt.sign({ _id: person._id }, "DevTinder@4321");
    res.cookie("token", token);

    // Success response
    res.send("User logged in successfully...");
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
