const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const adminAuth = require("../middlewares/auth");

router.post("/add-author", adminAuth, authorController.addAuthor);

// Update author details using name
router.put("/authors/:name", adminAuth, authorController.updateAuthor);

// List all authors
router.get("/authors", adminAuth, authorController.listAuthors);

// Search authors by name
router.get("/authors/search", adminAuth, authorController.searchAuthor);

// Delete author using name
router.delete("/authors/:name", adminAuth, authorController.deleteAuthor);

module.exports = router;
