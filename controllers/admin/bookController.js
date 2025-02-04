const multer = require("multer");
const path = require("path");
const { Book } = require("../../models");
const { Op } = require("sequelize");
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


// Add Book Controller
const addBook = async (req, res) => {
    try {
        const { title, description, author, publication } = req.body;
        // Check if the book already exists in the database (based on title and author)
        const existingBook = await Book.findOne({
            where: {
                title: title,
                author_name: author,
            },
        });

        if (existingBook) {
            return res.status(409).json({ message: "This book already exists in the database" });
        }

        // Ensure cover image is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        // Prepare cover image path
        const coverImagePath = path.join("uploads", req.file.filename);

        // Insert book into the database
        const book = await Book.create({
            title,
            description,
            author_name: author,
            publication: new Date(publication),
            cover_image: coverImagePath,
        });

        res.status(201).json({
            message: "Book added successfully",
            book,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
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

        // If a new cover image is provided in the request, update the image
        if (req.file) {
            // Delete the old cover image if it exists on the server
            if (fs.existsSync(coverImagePath)) {
                fs.unlinkSync(coverImagePath);
            }

            // Set the new cover image path
            coverImagePath = path.join("uploads", req.file.filename);
        }

        // Update book details in the database
        const updatedBook = await existingBook.update({
            description,
            publication,
            cover_image: coverImagePath
        });

        res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Book Controller
const deleteBook = async (req, res) => {
    try {
        // Get book title and author_name from URL parameters
        const { title, author_name } = req.params; 

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

        // Build the filters
        const filters = {};

        if (search) {
            filters[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { author_name: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (start_date) {
            filters.publication = { [Op.gte]: start_date };
        }
        if (end_date) {
            filters.publication = { ...filters.publication, [Op.lte]: end_date };
        }

        // Fetch books with filters, pagination, and sorting
        const books = await Book.findAll({
            where: filters,
            limit: limit,
            offset: offset,
            order: [['publication', 'DESC']]
        });
        // Get the total count of books for pagination
        const totalBooks = await Book.count({
            where: filters
        });
        
        res.status(200).json({
            message: "Books retrieved successfully",
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books,
        });
    } catch (error) {
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
