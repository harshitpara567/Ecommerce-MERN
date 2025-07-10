const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
    try {
        const { identifier, password } = req.body; // Accepting either email or phone number

        if (!identifier) {
            return res.status(400).json({ message: "Please provide an email or phone number", error: true, success: false });
        }
        if (!password) {
            return res.status(400).json({ message: "Please provide a password", error: true, success: false });
        }

        // Find user by email or phone number
        const user = await userModel.findOne({
            $or: [{ email: identifier }, { phoneNumber: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "User not found", error: true, success: false });
        }

        // Compare password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid credentials. Please check your password.", error: true, success: false });
        }

        // Create token
        const tokenData = {
            _id: user._id,
            email: user.email,
            phoneNumber: user.phoneNumber
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8h" });

        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        // Set cookie and send response
        res.cookie("token", token, tokenOption).status(200).json({
            message: "Login successful",
            success: true,
            error: false,
            token: token, // 🔹 Include token separately
            data: {
                _id: user._id, // ✅ Include user details
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;
