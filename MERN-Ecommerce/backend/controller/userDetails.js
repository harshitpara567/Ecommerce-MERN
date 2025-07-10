const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");
const path = require('path');

async function getUserDetails(req, res) {
  try {
    console.log("userId", req.params.userId);
    const user = await userModel.findById(req.params.userId);

    if (!user) {
        console.error("ERROR: User not found!", user);
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      data: user,
      error: false,
      success: true,
      message: "User details fetched successfully"
    });

    console.log("user", user);
  } catch (err) {
    res.status(400).json({
      message: err.message || "Error fetching user details",
      error: true,
      success: false
    });
  }
}

async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}, "-password");  // Exclude passwords
        res.status(200).json({
            data: users,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

// Update Profile Picture
async function updateProfilePicture(req, res) {
    try {
      const { userId } = req.params;
  
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No profile picture file uploaded." });
      }
  
    
  
      // Get the relative path
      const relativePath = path.relative(path.join(__dirname, '../uploads'), req.file.path).replace(/\\/g, '/');
      console.log("Calculated Relative Path:", relativePath);
  
      const user = await userModel.findByIdAndUpdate(
        userId,
        { profilePicture: relativePath }, // Save the relative path
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicture: user.profilePicture // Send back the updated relative path
      });
  
    } catch (err) {
      console.error("Error updating profile picture:", err);
      res.status(500).json({
        message: err.message || "Error updating profile picture",
        error: true,
        success: false
      });
    }
  }
  
module.exports = {
  getUserDetails,
  getAllUsers,
  updateProfilePicture
};
