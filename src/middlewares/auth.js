const jwt = require("jsonwebtoken");
const { user } = require("../models/user.js");

// Middleware to authenticate a user using JWT token from cookies
const userauth = async (req, res, next) => {
  try {
    // Extract token from cookies
    const { token } = req.cookies;

    // If no token is found, throw an error
    if (!token) {
      throw new Error("Token not provided.");
    }

    // Verify and decode the token using JWT secret
    // This will throw an error if the token is invalid or expired
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET); // Use process.env.JWT_SECRET in production

    // Extract user ID from the decoded token
    const { _id } = decoded_token;

    // Look up the user in the database
    const person = await user.findById(_id);

    // If no user found with that ID, throw an error
    if (!person) {
      throw new Error("User not found.");
    }

    // Attach the user object to the request so next middleware/route can access it
    req.user = person;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Handle all errors in one place and send response
    console.error("Authentication Error:", error.message);
    res.status(401).send("Authentication error: " + error.message);
  }
};

module.exports = {
  userauth,
};
