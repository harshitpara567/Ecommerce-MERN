const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
   
    try {
        const { email, phoneNumber, password, name } = req.body;
        let profilePicture = req.body.profilePicture || null; // Default null

        // ✅ Check if the profile picture is coming from a file upload
        if (req.file) {
            profilePicture = req.file.path; // Assuming Multer stores file path
        }

        // 🔹 Ensure either email or phone number is provided
        if (!email && !phoneNumber) {
            throw new Error("Please provide an email or phone number");
        }
        if (!password) {
            throw new Error("Please provide a password");
        }
        if (!name) {
            throw new Error("Please provide a name");
        }

        // 🔹 Check if user already exists with the same email or phone number
        const existingUser = await userModel.findOne({ 
            $or: [{ email }, { phoneNumber }] 
        });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: true,
                message: "User already exists with this email or phone number." 
            });
        }

        // 🔹 Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong while hashing the password");
        }

        // ✅ Prepare user data
        const userData = new userModel({
            name,
            email: email || null,
            phoneNumber: phoneNumber || null,
            password: hashPassword,
            profilePicture, // ✅ Store profile picture (either URL or file path)
            role: "GENERAL"
        });

        // 🔹 Save user to database
        const savedUser = await userData.save();

        res.status(201).json({
            data: savedUser,
            success: true,
            error: false,
            message: "User created successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
