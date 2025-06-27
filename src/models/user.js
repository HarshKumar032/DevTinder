const mongoose = require("mongoose");
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
      unique: [true,"This Email id already exists"],
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
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);

module.exports = { user };
