const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middlewares/authUser");
const { bookController } = require("../../controllers/user");

// List,search,filter books
router.get("/books", authenticateUser, bookController.listBooks);

module.exports = router;
