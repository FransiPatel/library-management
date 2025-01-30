const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
require("dotenv").config();

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ message: "Access denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

        const redisToken = await redisClient.get(`admin_${decoded.id}_token`);
        if (!redisToken || redisToken !== token) return res.status(403).json({ message: "Invalid session" });

        req.admin = decoded; // Attach admin info to request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = adminAuth;
