const express = require("express");
const app = express();
const { connectDB } = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); //will apply to all http methods->used for converting json to js object
app.use(cookieParser()); //middleware for reading the cookies

const userRouter = require("./routes/user.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const viewRouter = require("./routes/view.js");

app.use("/", userRouter, profileRouter, requestRouter, viewRouter);

connectDB().then(() => {
  console.log("Database connected succesfully...");
  app.listen(process.env.PORT, () => {
    console.log("Server started on PORT 3000...");
  });
});
