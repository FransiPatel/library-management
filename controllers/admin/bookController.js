const multer = require("multer");
const path = require("path");
const { Book } = require("../../models"); // Import the Sequelize Book model
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

// Add Book Controller
const addBook = async (req, res) => {
    try {
        const { title, description, author_name, publication } = req.body;

        // Check if the book already exists
        const existingBook = await Book.findOne({
            where: { title, author_name }
        });

        if (existingBook) {
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
            const book = await Book.create({
                title,
                description,
                author_name,
                publication: new Date(publication),
                cover_image: coverImagePath
            });

            res.status(201).json({
                message: "Book added successfully",
                book,
            });
        });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Book Controller
const updateBook = async (req, res) => {
    try {
        const { title, author_name } = req.params;
        const { description, publication } = req.body;

        // Find the book in the database
        const existingBook = await Book.findOne({
            where: { title, author_name }
        });

        if (!existingBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Store old cover image path
        let coverImagePath = existingBook.cover_image;

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
            const updatedBook = await existingBook.update({
                description,
                publication,
                cover_image: coverImagePath
            });

            res.status(200).json({
                message: "Book updated successfully",
                book: updatedBook,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Book Controller
const deleteBook = async (req, res) => {
    try {
        const { title, author_name } = req.params; // Get book title and author_name from URL parameters

        // Find the book in the database
        const existingBook = await Book.findOne({
            where: { title, author_name }
        });
        
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Delete the cover image from the server
        const coverImagePath = existingBook.cover_image;
        if (fs.existsSync(coverImagePath)) {
            fs.unlinkSync(coverImagePath);
        }

        // Delete the book from the database
        await existingBook.destroy();

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// List Books Controller
const listBooks = async (req, res) => {
    try {
        let { search, start_date, end_date, page, limit } = req.query;

        // Default values for pagination
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        // Build query filters
        let whereConditions = {};
        if (search) {
            whereConditions = {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { author_name: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }

        if (start_date) {
            whereConditions.publication = { [Op.gte]: new Date(start_date) };
        }

        if (end_date) {
            whereConditions.publication = { [Op.lte]: new Date(end_date) };
        }

        // Fetch books from database
        const books = await Book.findAll({
            where: whereConditions,
            limit,
            offset,
            order: [["publication", "DESC"]]
        });

        // Get total count of books for pagination metadata
        const totalBooks = await Book.count({ where: whereConditions });

        res.status(200).json({
            message: "Books retrieved successfully",
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books,
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
