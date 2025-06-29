const { userauth } = require("../middlewares/auth.js");

const express = require("express");
const requestRouter = express.Router();

//API for sending the connection request
requestRouter.post("/sendconnectionrequest", userauth, (req, res) => {
  try {
    const person = req.user;
    res.send(person.firstName + " sent connection request..");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = requestRouter;
