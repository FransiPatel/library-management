const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const { bookController } = require("../../controllers/admin");

// Admin Add Book Route
<<<<<<< HEAD
router.post("/add-book", upload, adminAuth, addBook);
=======
router.post("/add-book", upload, adminAuth, bookController.addBook);
>>>>>>> c5d7671 (improved structure)

// List,search,filter books
router.get("/books", adminAuth, bookController.listBooks);

// Update book details (including cover image) - Use title and author instead of id
<<<<<<< HEAD
router.put("/books/:title/:author_name", upload, adminAuth, updateBook);
=======
router.put("/books/:id", upload, adminAuth, bookController.updateBook);
>>>>>>> c5d7671 (improved structure)

// Delete book - Use title and author instead of id
router.delete("/books/:id", adminAuth, bookController.deleteBook);

module.exports = router;
