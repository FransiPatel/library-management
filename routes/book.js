const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const adminAuth = require("../middlewares/auth");
const { listBooks, searchBooks, updateBook, deleteBook, upload } = require("../controllers/bookController");

// Admin Add Book Route
router.post("/add-book", adminAuth, bookController.upload.single("coverImage"), bookController.addBook);

// List books
router.get("/books", adminAuth, listBooks);

// Search books by title or author
router.get("/books/search", adminAuth, searchBooks);

// Update book details (including cover image) - Use title and author instead of id
router.put("/books/:title/:author", adminAuth, upload.single("coverImage"), updateBook);

// Delete book - Use title and author instead of id
router.delete("/books/:title/:author", adminAuth, deleteBook);

module.exports = router;
