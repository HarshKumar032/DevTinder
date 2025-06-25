const express = require("express");
const { connectDB } = require("./config/db.js");
const app = express();
const { user } = require("./models/user.js");

app.post("/signup", async (req, res) => {
  const User = new user({
    firstName: "Dharmendra",
    lastname: "Shaw",
    password: "Dk",
    age: 52,
  });

  try {
    await User.save();
    res.send("User added succesfully...");
  } catch (error) {
    console.error("Error occured...");
  }
});

connectDB().then(() => {
  console.log("Database connected succesfully...");
  app.listen(3000, () => {
    console.log("Server started on PORT 3000...");
  });
});
