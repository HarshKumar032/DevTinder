const express = require("express");
const app = express();

const { userauth, adminauth } = require("./middlewares/auth.js");

app.post("/user/login", (req, res) => {
  res.send("User logged in succesfully"); //login do not require authentication
});

//Routes get executed in sequential manner
app.use("/user", userauth);
app.use("/admin", adminauth);

app.post("/admin/sentData", (req, res) => {
  res.send("Admin data sent!");
});

app.post("/user/sentData", (req, res) => {
  res.send("Data sent!");
});

app.delete("/user/deleteData", (req, res) => {
  res.send("Data deleted!");
});

app.listen(3000, () => {
  console.log("Server started on PORT 3000...");
});
