const express = require('express');
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const upload = require("../config/cloudinary");

const router = express.Router();

router.put("/update-profile", authenticate, upload.single("profilePic"), async (req, res) => {
    try {
        const userId = req.user.userId;

        console.log("User ID:", userId); // Debug user ID
        console.log("File uploaded:", req.file); // Check what Multer/Cloudinary returns

        if (!req.file || (!req.file.path && !req.file.secure_url)) {
            return res.status(400).json({ message: "Please select a profile picture." });
        }

        // Prefer secure_url for full HTTPS path, fallback to path if not available
        const profilePicUrl = req.file.secure_url || req.file.path;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl },
            { new: true }
        );

        res.status(200).json({ message: "Profile Updated", profilePic: updatedUser.profilePic });
    } catch (error) {
        console.error("Error in /update-profile:", error); // Log full error
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
