const express = require("express");
const app = express();
const { connectDB } = require("./config/db.js");
const cookieParser = require("cookie-parser");

app.use(express.json()); //will apply to all http methods->used for converting json to js object
app.use(cookieParser()); //middleware for reading the cookies

const userRouter = require("./routes/user.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/",userRouter,profileRouter,requestRouter);

connectDB().then(() => {
  console.log("Database connected succesfully...");
  app.listen(3000, () => {
    console.log("Server started on PORT 3000...");
  });
});
