const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models"); // Use Users table
const redisClient = require("../../config/redis");
require("dotenv").config();

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Admin Login Attempt:", { email, password });

        // Fetch Admin from "Users" Table
        const admin = await User.findOne({ where: { email, role: "admin" } });

        if (!admin) {
            console.log("No admin found with this email and role.");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Admin Record Found:", admin.toJSON());

        // Compare Passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        console.log("Password Match:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("Password does not match.");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Store Token in Redis
        await redisClient.set(`admin_${admin.id}_token`, token, { EX: 3600 });

        console.log("Login successful. Token generated.");
        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { adminLogin };
