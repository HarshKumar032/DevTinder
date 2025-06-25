const express = require("express");
const app = express();
const { connectDB } = require("./config/db.js");
const { user } = require("./models/user.js");

app.use(express.json()); //will apply to all http methods->used for converting json to js object

//API for adding a new user
app.post("/signup", async (req, res) => {
  const User = new user(req.body);

  try {
    await User.save();
    res.send("User added succesfully...");
  } catch (error) {
    console.error("Error occured...");
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
app.patch("/user", async (req, res) => {
  try {
    const personId = req.body.userId;
    const data = req.body;
    await user.findByIdAndUpdate(personId, data);
    res.send("User updated succesfully...");
  } catch (error) {
    console.error("Something went wrong");
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
