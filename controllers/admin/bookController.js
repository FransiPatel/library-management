const multer = require("multer");
const path = require("path");
const pool = require("../../config/db");
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

const upload = multer({ storage: storage }).single("coverImage");

const addBook = async (req, res) => {
    try {
        const { title, description, author_name, publication } = req.body;

        // Check if the book already exists
        const existingBook = await pool.query(
            "SELECT * FROM books WHERE title = $1 AND author_name = $2",
            [title, author_name]
        );

        if (existingBook.rows.length > 0) {
            return res.status(409).json({ message: "This book already exists in the database" });
        }

        // Now upload file only after book validation
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: "File upload error", error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ message: "Cover image is required" });
            }

            const coverImagePath = path.join("coverpage", req.file.filename);

            // Insert book into the database
            const result = await pool.query(
                "INSERT INTO books (title, description, author_name, publication, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [title, description, author_name, new Date(publication), coverImagePath]
            );

            res.status(201).json({
                message: "Book added successfully",
                book: result.rows[0],
            });
        });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update book details (title, description, author_name, publication, cover image)
const updateBook = async (req, res) => {
    try {
        const { title, author_name } = req.params;
        const { description, publication } = req.body;

        // Find the book in the database
        const existingBook = await pool.query(
            "SELECT * FROM books WHERE title = $1 AND author_name = $2",
            [title, author_name]
        );

        if (existingBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Store old cover image path
        let coverImagePath = existingBook.rows[0].cover_image;

        // Handle file upload only if a new image is provided
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: "File upload error", error: err.message });
            }

            if (req.file) {
                // Delete old cover image from server
                if (fs.existsSync(coverImagePath)) {
                    fs.unlinkSync(coverImagePath);
                }
                // Set new cover image path
                coverImagePath = path.join("coverpage", req.file.filename);
            }

            // Update book in the database
            const result = await pool.query(
                "UPDATE books SET description = $1, publication = $2, cover_image = $3 WHERE title = $4 AND author_name = $5 RETURNING *",
                [description, publication, coverImagePath, title, author_name]
            );

            res.status(200).json({
                message: "Book updated successfully",
                book: result.rows[0],
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    try {
        const { title, author_name } = req.params; // Get book title and author_name from URL parameters

        // Find the book in the database
        const existingBook = await pool.query(
            "SELECT * FROM books WHERE title = $1 AND author_name = $2",
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

const listBooks = async (req, res) => {
    try {
        let { search, start_date, end_date, page, limit } = req.query;

        // Default values for pagination
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM books WHERE 1=1`;
        let values = [];

        // Search filter (title or author_name)
        if (search) {
            values.push(`%${search}%`);
            query += ` AND (title ILIKE $${values.length} OR author_name ILIKE $${values.length})`;
        }

        // Filter by publication date range
        if (start_date) {
            values.push(start_date);
            query += ` AND publication >= $${values.length}`;
        }
        if (end_date) {
            values.push(end_date);
            query += ` AND publication <= $${values.length}`;
        }

        // Add pagination
        values.push(limit, offset);
        query += ` ORDER BY publication DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

        // Fetch books
        const result = await pool.query(query, values);

        // Get total count of books (for pagination metadata)
        const countResult = await pool.query("SELECT COUNT(*) FROM books");
        const totalBooks = parseInt(countResult.rows[0].count);

        res.status(200).json({
            message: "Books retrieved successfully",
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books: result.rows
        });
    } catch (error) {
        console.error("Error listing books:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = {
    addBook,
    updateBook,
    deleteBook,
    listBooks,
    upload,
};
