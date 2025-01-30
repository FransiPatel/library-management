const express = require("express");
const adminAuth = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Admin Login Route
router.post("/login", adminController.adminLogin);

// Admin Logout Route
router.post("/logout", adminController.adminLogout);

// Admin Dashboard Route
router.get("/dashboard", adminAuth, adminController.dashboard);

module.exports = router;
