const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

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
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email id");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      maxLength: [20, "Password cannot exceed 20 characters"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("enter a strong password");
        }
      },
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
