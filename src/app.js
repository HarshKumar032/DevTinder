const express = require("express");
const app = express();
const { connectDB } = require("./config/db.js");
const { user } = require("./models/user.js");
const bcrypt = require("bcrypt");
const { validatesignup } = require("./utils/validation.js");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userauth } = require("./middlewares/auth.js");

app.use(express.json()); //will apply to all http methods->used for converting json to js object
app.use(cookieParser()); //middleware for reading the cookies

//API for adding a new user
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
    const isPasswordValid = await bcrypt.compare(password, person.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password.");
    }

    //Sending the JWT
    const token = jwt.sign({ _id: person._id }, "DevTinder@4321", {
      expiresIn: "8h",
    });
    res.cookie("token", token);

    // Success response
    res.send("User logged in successfully...");
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).send(error.message);
  }
});

//API for getting the user profile
app.get("/profile", userauth, async (req, res) => {
  try {
    const person = req.user;
    res.status(200).send(person);
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(400).send(error.message);
  }
});

//API for sending the connection request
app.post("/sendconnectionrequest", userauth, (req, res) => {
  try {
    const person = req.user;
    res.send(person.firstName + " sent connection request..");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectDB().then(() => {
  console.log("Database connected succesfully...");
  app.listen(3000, () => {
    console.log("Server started on PORT 3000...");
  });
});
