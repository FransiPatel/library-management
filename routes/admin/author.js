const express = require("express");
const router = express.Router();
const { authorController } = require("../../controllers/admin");

const adminAuth = require("../../middlewares/auth");

router.post("/add", adminAuth, authorController.addAuthor);

// Update author details using name
router.put("/update/:id", adminAuth, authorController.updateAuthor);

// List, search all authors
router.get("/authors", adminAuth, authorController.listAuthors);

// Delete author using name
router.delete("/delete/:id", adminAuth, authorController.deleteAuthor);

module.exports = router;
