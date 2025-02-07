const express = require("express");
const router = express.Router();
const { userLoginController } = require("../../controllers/user");

// Login route
router.post("/login", userLoginController.loginUser);

module.exports = router;
