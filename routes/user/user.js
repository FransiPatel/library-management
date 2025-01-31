const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userRegisterController");
const { loginUser } = require("../../controllers/user/userLoginController");
const authenticateUser = require("../../middlewares/authUser");
const { listBooks } = require("../../controllers/user/bookController");

router.post("/register", userController.registerUser);

// Login route
router.post("/login", loginUser);

router.get("/books", authenticateUser, listBooks);

module.exports = router;
