const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "This Email id already exists"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    age: {
      type: Number,
      min: [18, "Minimum age is 18"],
      max: [60, "Maximum age is 60"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    about: {
      type: String,
      default: "This is the default description for the user",
    },
    skills: {
      type: [String],
    },
    photourl: {
      type: String,
      default: "https://api.dicebear.com/6.x/pixel-art/svg?seed=Harsh",
      validate(value) {
        if (!validator.isURL) {
          throw new Error("Invalid photo url..");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatepassword = async function (userinputpassword) {
  // 'this' refers to the current user document
  const user = this;

  // Compare the provided password with the hashed password stored in DB
  const isPasswordValid = await bcrypt.compare(
    userinputpassword,
    user.password
  );

  // Return true or false
  return isPasswordValid;
};

const user = mongoose.model("User", userSchema);

module.exports = { user };
