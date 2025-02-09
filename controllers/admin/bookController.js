const path = require("path");
const { Book, Author } = require("../../models");
const { Op } = require("sequelize");
const fs = require("fs");
const validator = require("validator");
// Add Book API
const addBook = async (req, res) => {
    try {
        const { title, description, author_id, publication } = req.body;

        // Validate input
        if (!title || !description || !author_id || !publication) {
            return res.status(400).json({ message: "title, description, author_id, publication are required" });
        }
        if (!validator.isDate(publication)) {
            return res.status(400).json({ message: "Invalid publication date" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        // Check if the author exists
        const author = await Author.findByPk(author_id);
        if (!author) return res.status(400).json({ message: "Author not found" });

        // Check if the book already exists
        const existingBook = await Book.findOne({ where: { title, author_id } });
        if (existingBook) return res.status(400).json({ message: "This book already exists" });

        const coverImagePath = path.join("coverpage", req.file.filename);

        const book = await Book.create({
            title,
            description,
            author_id,
            publication: new Date(publication),
            cover_image: coverImagePath,
        });

        res.status(200).json({ message: "Book added successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update Book API
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, publication } = req.body;

        if (publication && !validator.isDate(publication)) {
            return res.status(400).json({ message: "Invalid publication date" });
        }

        const book = await Book.findByPk(id);
        if (!book) return res.status(400).json({ message: "Book not found" });

        let coverImagePath = book.cover_image;

        if (req.file) {
            if (fs.existsSync(coverImagePath)) fs.unlinkSync(coverImagePath);
            coverImagePath = path.join("coverpage", req.file.filename);
        }

        await book.update({ title, description, publication, cover_image: coverImagePath });

        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Book API
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID
        if (!validator.isUUID(id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const book = await Book.findByPk(id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // delete book cover image
        if (fs.existsSync(book.cover_image)) fs.unlinkSync(book.cover_image);

        // Soft delete the book
        await book.destroy();

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// List Books API
const listBooks = async (req, res) => {
    try {
        let { search, start_date, end_date, page, limit } = req.query;

        // Validate pagination
        page = page && validator.isInt(page, { min: 1 }) ? parseInt(page) : 1;
        limit = limit && validator.isInt(limit, { min: 1 }) ? parseInt(limit) : 5;
        const offset = (page - 1) * limit;

        const filters = {};
        if (search) {
            filters.title = { [Op.iLike]: `%${search}%` };
        }

        if (start_date && end_date) {
            filters.publication = {
                [Op.between]: [start_date, end_date] 
            };
        } else if (start_date || end_date) {
            return res.status(400).json({ message: "Both start_date and end_date are required for range filtering." });
        }

        const books = await Book.findAll({
            where: filters,
            include: [{ model: Author, attributes: ["id", "name"] }],
            limit,
            offset,
            order: [["publication", "DESC"]],
        });

        res.status(200).json({ message: "Books retrieved successfully", books });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    addBook,
    updateBook,
    deleteBook,
    listBooks,
};
