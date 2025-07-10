const express = require("express");
const { userauth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const { user } = require("../models/user");
const viewRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// API to get all pending connection requests for the logged-in user
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
      .populate("fromUserId", USER_SAFE_DATA); // Only select relevant user fields

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

// API to view all my connections
viewRouter.get("/view/connections", userauth, async (req, res) => {
  try {
    // Get the logged-in user's data from the request
    const loggedInUser = req.user;

    // Fetch all connection requests where:
    // - the user is either the sender or the receiver
    // - and the status of the connection is "accepted"
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      // Populate details of the sender and receiver with only safe fields
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // Extract the "other user" from each connection (i.e., not the logged-in user)
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        // If the logged-in user is the sender, return the receiver
        return row.toUserId;
      }
      // Else, return the sender
      return row.fromUserId;
    });

    // Send the processed list of connected users
    res.json({ data });
  } catch (err) {
    // Handle any errors during the process
    res.status(400).send({ message: err.message });
  }
});

//API to view feeds
viewRouter.get("/view/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = viewRouter;
