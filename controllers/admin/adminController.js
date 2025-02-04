const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models"); 
const redisClient = require("../../config/redis");
require("dotenv").config();

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Fetch Admin from "Users" Table
        const admin = await User.findOne({ where: { email, role: "admin" } });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Compare Passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Store Token in Redis
        await redisClient.set(`admin_${admin.id}_token`, token, { EX: 3600 });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { adminLogin };
