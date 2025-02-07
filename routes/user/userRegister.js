const express = require("express");
const router = express.Router();
const { userRegisterController} = require("../../controllers/user");

router.post("/register", userRegisterController.registerUser);

module.exports = router;
