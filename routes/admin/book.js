const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const { bookController } = require("../../controllers/admin");

// Admin Add Book Route
router.post("/add-book", upload, adminAuth, bookController.addBook);

// List,search,filter books
router.get("/books", adminAuth, bookController.listBooks);

// Update book details (including cover image) - Use title and author instead of id
router.put("/books/:id", upload, adminAuth, bookController.updateBook);
// Delete book - Use title and author instead of id
router.delete("/books/:id", adminAuth, bookController.deleteBook);

module.exports = router;
