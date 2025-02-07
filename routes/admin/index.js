const express = require("express");
const adminRoutes = require("./admin");
const authorRoutes = require("./author");
const bookRoutes = require("./book");

const router = express.Router();

// Combine all admin-related routes
router.use("/", adminRoutes);
router.use("/", authorRoutes);
router.use("/", bookRoutes);

module.exports = router;
