const express = require("express");
const { userauth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const viewRouter = express.Router();

// Route to get all pending connection requests for the logged-in user
viewRouter.get("/view/request/pending", userauth, async (req, res) => {
  try {
    // Get the logged-in user's info from the auth middleware
    const loggedInUser = req.user;

    // Find all connection requests sent *to* this user with status "interested"
    // Also populate details about the sender (fromUserId)
    const pendingRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested", // 'interested' means the request is still pending review
      })
      .populate("fromUserId", "firstName lastName gender age skills about"); // Only select relevant user fields

    // Respond with the pending requests and their count
    res.status(200).json({
      count: pendingRequests.length, // Helpful for frontend (e.g., showing a badge)
      requests: pendingRequests,
    });
  } catch (error) {
    // Catch and return any errors during DB operations
    res.status(500).json({
      message: "Failed to fetch pending requests",
      error: error.message,
    });
  }
});

module.exports = viewRouter;
