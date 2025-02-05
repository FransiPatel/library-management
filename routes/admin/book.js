const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/auth");
const { listBooks, updateBook, deleteBook, addBook, upload } = require("../../controllers/admin/bookController");

// Admin Add Book Route
router.post("/add-book", upload, adminAuth, addBook);

// List,search,filter books
router.get("/books", adminAuth, listBooks);

// Update book details (including cover image) - Use title and author instead of id
router.put("/books/:title/:author_name", upload, adminAuth, updateBook);

// Delete book - Use title and author instead of id
router.delete("/books/:title/:author_name", adminAuth, deleteBook);

module.exports = router;
