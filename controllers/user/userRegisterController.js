const bcrypt = require("bcryptjs");
const validator = require("validator");
const { User } = require("../../models");
const { sendConfirmationEmail } = require("../../helpers/emailHelper");
require("dotenv").config();

// Registration API
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password (min 6 characters, at least one number and one special character)
        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if the user already exists using Sequelize
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({
            name: username,
            email: email,
            password: hashedPassword,
        });

        // Send confirmation email after registration
        await sendConfirmationEmail(newUser.email, newUser.name);
        res.status(200).json({
            message: "User registered successfully. Please check your email for confirmation.",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerUser,
};
