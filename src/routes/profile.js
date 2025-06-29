const { userauth } = require("../middlewares/auth.js");
const { validateeditprofiledata } = require("../utils/validation.js");

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

module.exports = profileRouter;
