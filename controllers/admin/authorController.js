const { Author } = require("../../models");
const { Op } = require("sequelize"); 

// Add Author Controller
const addAuthor = async (req, res) => {
    try {
        const { name, gender } = req.body;

        // Check if author already exists
        const existingAuthor = await Author.findOne({ where: { name } });

        if (existingAuthor) {
            return res.status(409).json({ message: "Author already exists" });
        }

        // Insert new author into the database
        const newAuthor = await Author.create({ name, gender });

        res.status(201).json({
            message: "Author added successfully",
            author: newAuthor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Author Controller
const updateAuthor = async (req, res) => {
    try {
        const { name } = req.params;  // Retrieve author name from URL parameter
        const { gender } = req.body;

        // Check if the author exists
        const existingAuthor = await Author.findOne({ where: { name } });

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        // Update author details
        existingAuthor.gender = gender;
        await existingAuthor.save();

        res.status(200).json({
            message: "Author updated successfully",
            author: existingAuthor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// List All Authors Controller
const listAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();

        res.status(200).json({
            message: "Authors retrieved successfully",
            authors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Search Author Controller
const searchAuthor = async (req, res) => {
    try {
        const { name } = req.query;

        // Search for authors based on name
        const authors = await Author.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`,  // Case-insensitive search
                },
            },
        });

        if (authors.length === 0) {
            return res.status(404).json({ message: "No authors found" });
        }

        res.status(200).json({
            message: "Authors retrieved successfully",
            authors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Author Controller
const deleteAuthor = async (req, res) => {
    try {
        const { name } = req.params;  // Retrieve author name from URL parameter

        // Check if the author exists
        const existingAuthor = await Author.findOne({ where: { name } });

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        // Delete the author from the database
        await existingAuthor.destroy();

        res.status(200).json({ message: "Author deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    addAuthor,
    updateAuthor,
    listAuthors,
    searchAuthor,
    deleteAuthor,
};
