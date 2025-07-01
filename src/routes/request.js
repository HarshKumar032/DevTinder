const express = require("express");
const mongoose = require("mongoose");
const { userauth } = require("../middlewares/auth.js");
const connectionRequest = require("../models/connectionRequest.js");
const { user } = require("../models/user.js");

const requestRouter = express.Router();

// API for sending the connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userauth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Validate status
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      // Check if user exists
      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check for existing connection
      const existing = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existing) {
        return res
          .status(400)
          .json({ message: "Connection request already exists." });
      }

      // Create and save new connection request
      const newConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();

      res.json({
        message: "Connection Request sent",
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:reqId",
  userauth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status.toLowerCase();
      const reqId = req.params.reqId;

      // Validate status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(reqId)) {
        return res.status(400).json({ message: "Invalid request ID format" });
      }

      // Check if the request exists and is still "interested"
      const validConnectionRequest = await connectionRequest.findOne({
        _id: reqId,
        status: "interested",
        toUserId: loggedInUser._id,
      });

      if (!validConnectionRequest) {
        return res
          .status(404)
          .json({ message: "Invalid or already reviewed connection request." });
      }

      // Update the request status
      validConnectionRequest.status = status;
      const updatedRequest = await validConnectionRequest.save();

      res.json({
        message: "Connection request " + status,
        request: updatedRequest,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error: " + error.message });
    }
  }
);

module.exports = requestRouter;
