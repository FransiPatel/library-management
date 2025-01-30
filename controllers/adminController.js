const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const redisClient = require("../config/redis");
require("dotenv").config();

// Admin Login Controller
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch Admin from Database
        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND role = 'admin'", [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const admin = result.rows[0];

        // Compare Passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Store Token in Redis
        await redisClient.set(`admin_${admin.id}_token`, token, { EX: 3600 });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin Logout Controller
const adminLogout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await redisClient.del(`admin_${decoded.id}_token`);

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Dashboard Controller
const dashboard = (req, res) => {
    res.json({ message: "Welcome Admin" });
};



module.exports = {
    adminLogin,
    adminLogout,
    dashboard,
};
