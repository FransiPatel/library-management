const express = require("express");
const { adminController} = require("../../controllers/admin");

const router = express.Router();

// Admin Login Route
router.post("/login", adminController.adminLogin);

module.exports = router;
