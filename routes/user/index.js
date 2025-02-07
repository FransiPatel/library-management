const express = require("express");
const bookRoutes = require("./book");
const loginRoutes = require("./userLogin");
const registerRoutes = require("./userRegister");

const router = express.Router();

// Combine all user-related routes
router.use("/", registerRoutes);
router.use("/", loginRoutes);
router.use("/", bookRoutes);

module.exports = router;
