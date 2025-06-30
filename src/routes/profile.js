const { userauth } = require("../middlewares/auth.js");
const { validateeditprofiledata } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

const express = require("express");
const profileRouter = express.Router();

//API for getting the user profile
profileRouter.get("/profile/view", userauth, async (req, res) => {
  try {
    const person = req.user;
    res.status(200).send(person);
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(400).send(error.message);
  }
});

//API for editing the user profile
profileRouter.patch("/profile/edit", userauth, async (req, res) => {
  try {
    // Validate the edit data (throws if invalid)
    validateeditprofiledata(req);

    const person = req.user;

    // Update allowed fields only
    Object.keys(req.body).forEach((key) => {
      person[key] = req.body[key];
    });

    await person.save();

    res.send("Profile updated successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//API for forgot password
profileRouter.patch("/profile/password", userauth, async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
      return res.status(400).send("Both old and new passwords are required.");
    }

    const person = req.user;

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldpassword, person.password);
    if (!isMatch) {
      return res.status(401).send("Old password is incorrect.");
    }

    // Hash and update new password
    const newhashedpassword = await bcrypt.hash(newpassword, 10);
    person.password = newhashedpassword;
    await person.save();

    res.send("Password changed successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = profileRouter;
