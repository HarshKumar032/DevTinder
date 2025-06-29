const express = require("express");
const profileRouter = express.Router();

const { userauth } = require("../middlewares/auth.js");

//API for getting the user profile
profileRouter.get("/profile", userauth, async (req, res) => {
  try {
    const person = req.user;
    res.status(200).send(person);
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
