const express = require("express");
const adminRoutes = require("./admin");
const authorRoutes = require("./author");
const bookRoutes = require("./book");

const router = express.Router();

// Combine all admin-related routes
router.use("/auth", adminRoutes);
router.use("/author", authorRoutes);
router.use("/book", bookRoutes);

module.exports = router;
