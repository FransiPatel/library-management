const express = require("express");
const bookRoutes = require("./book");
const loginRoutes = require("./userLogin");
const registerRoutes = require("./userRegister");

const router = express.Router();

// Combine all user-related routes
router.use("/register", registerRoutes);
router.use("/auth", loginRoutes);
router.use("/book", bookRoutes);

module.exports = router;
