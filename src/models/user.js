const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastname: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
});

const user = mongoose.model("usermodel", userSchema);

module.exports = {
  user,
};
