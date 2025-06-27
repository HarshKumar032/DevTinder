const express = require("express");
const app = express();
const { connectDB } = require("./config/db.js");
const { user } = require("./models/user.js");
const bcrypt = require("bcrypt");
const { validatesignup } = require("./utils/validation.js");
const validator = require("validator");

app.use(express.json()); //will apply to all http methods->used for converting json to js object

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

    // Success response
    res.send("User logged in successfully...");
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).send(error.message);
  }
});

//API to GET user by emailId
app.get("/user", async (req, res) => {
  try {
    const person = await user.find({ email: req.body.email });
    res.send(person);
  } catch (error) {
    console.error("Something went wrong");
  }
});

//API to get feed of all users
app.get("/feed", async (req, res) => {
  try {
    const person = await user.find({});
    res.send(person);
  } catch (error) {
    console.error("Something went wrong");
  }
});

//API to delete a user
app.delete("/user", async (req, res) => {
  try {
    const personId = req.body.userId;
    //await user.findByIdAndDelete({_id:personId}); //We can do this also
    await user.findByIdAndDelete(personId);
    res.send("User deleted succesfully...");
  } catch (error) {
    console.error("Something went wrong");
  }
});

//API to update a user with a given userId
app.patch("/user/:userId", async (req, res) => {
  try {
    const personId = req.params.userId;
    const data = req.body;

    const allowed_fields = ["age", "about", "gender", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowed_fields.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for some feilds");
    } else if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10..");
    } else {
      await user.findByIdAndUpdate(personId, data);
      res.send("User updated succesfully...");
    }
  } catch (error) {
    console.error("Something went wrong");
    res.status(400).send(error.message);
  }
});

//API to update a user with a given email
app.patch("/update", async (req, res) => {
  try {
    const person_email = req.body.email;
    const data = req.body;
    await user.findOneAndUpdate({ email: person_email }, data);
    res.send("user updated succesfully...");
  } catch (error) {
    console.error("something went wrong...");
  }
});

connectDB().then(() => {
  console.log("Database connected succesfully...");
  app.listen(3000, () => {
    console.log("Server started on PORT 3000...");
  });
});
