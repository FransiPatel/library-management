const multer = require("multer");
const path = require("path");
const pool = require("../config/db");
const fs = require("fs");

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "coverpage/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

// Add Book Controller with Duplication Check and Conditional File Upload
const addBook = async (req, res) => {
    try {
        const { title, description, author_name, publication } = req.body;

        // Check if the book already exists in the database (based on title and author_name)
        const existingBook = await pool.query(
            "SELECT * FROM books WHERE title = $1 AND author_name = $2",
            [title, author_name]
        );

        if (existingBook.rows.length > 0) {
            return res.status(409).json({ message: "This book already exists in the database" });
        }

        // Ensure cover image is uploaded if the book does not exist
        if (!req.file) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        // Prepare cover image path
        const coverImagePath = path.join("coverpage", req.file.filename);

        // Insert book into PostgreSQL
        const result = await pool.query(
            "INSERT INTO books (title, description, author_name, publication, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, description, author_name, publication, coverImagePath]
        );

        res.status(201).json({
            message: "Book added successfully",
            book: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// List all books
const listBooks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books");
        res.status(200).json({ books: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Search for books by title or author
const searchBooks = async (req, res) => {
    try {
        const { query } = req.query; // Search query
        const result = await pool.query(
            "SELECT * FROM books WHERE title ILIKE $1 OR author_name ILIKE $1", // Updated to use author_name
            [`%${query}%`]
        );
        res.status(200).json({ books: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update book details (title, description, author_name, publication, cover image)
const updateBook = async (req, res) => {
    try {
        const { title, author_name } = req.params; // Get book title and author_name from URL parameters
        const { description, publication } = req.body;

        // Find the book in the database
        const existingBook = await pool.query(
            "SELECT * FROM books WHERE title = $1 AND author_name = $2", // Updated to use author_name
            [title, author_name]
        );
        if (existingBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // If a new cover image is provided, delete the old one
        let coverImagePath = existingBook.rows[0].cover_image;
        if (req.file) {
            // Delete old cover image from server
            if (fs.existsSync(coverImagePath)) {
                fs.unlinkSync(coverImagePath);
            }
            // Prepare new cover image path
            coverImagePath = path.join("coverpage", req.file.filename);
        }

        // Update book in the database
        const result = await pool.query(
            "UPDATE books SET description = $1, publication = $2, cover_image = $3 WHERE title = $4 AND author_name = $5 RETURNING *", // Updated to use author_name
            [description, publication, coverImagePath, title, author_name]
        );

        res.status(200).json({
            message: "Book updated successfully",
            book: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Delete book
const deleteBook = async (req, res) => {
    try {
        const { title, author_name } = req.params; // Get book title and author_name from URL parameters

        // Find the book in the database
        const existingBook = await pool.query(
            "SELECT * FROM books WHERE title = $1 AND author_name = $2", // Updated to use author_name
            [title, author_name]
        );
        if (existingBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Delete the cover image from the server
        const coverImagePath = existingBook.rows[0].cover_image;
        if (fs.existsSync(coverImagePath)) {
            fs.unlinkSync(coverImagePath);
        }

        // Delete the book from the database
        await pool.query("DELETE FROM books WHERE title = $1 AND author_name = $2", [title, author_name]);

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    addBook,
    listBooks,
    searchBooks,
    updateBook,
    deleteBook,
    upload, // Exporting multer upload for use in the routes
};
