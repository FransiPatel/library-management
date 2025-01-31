const express = require("express");
const router = express.Router();
const userController = require("../controllers/userRegisterController");
const { loginUser } = require("../controllers/userLoginController");
const authenticateUser = require("../middlewares/authUser");
const { listBooks } = require("../controllers/bookController");

router.post("/register", userController.registerUser);

// Login route
router.post("/login", loginUser);

router.get("/books", authenticateUser, listBooks);

module.exports = router;
