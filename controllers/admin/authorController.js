const { Author, Book } = require("../../models");
const { Op } = require("sequelize");
const validator = require("validator");

// Add Author API
const addAuthor = async (req, res) => {
    try {
        const { name, gender } = req.body;

        // Validate input
        if (!name || !gender) {
            return res.status(400).json({ message: "Name and gender are required" });
        }
        if (!validator.isAlpha(name.replace(/\s/g, ""))) {
            return res.status(400).json({ message: "Name must contain only letters" });
        }

        // Convert gender to lowercase and validate
        const formattedGender = gender.toLowerCase();
        if (!["male", "female", "other"].includes(formattedGender)) {
            return res.status(400).json({ message: "Gender must be 'male', 'female', or 'other'" });
        }

        const newAuthor = await Author.create({ name, gender: formattedGender });
        res.status(200).json({ message: "Author added successfully", author: newAuthor });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update Author API
const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, gender } = req.body;

        // Validate input
        if (name && !validator.isAlpha(name.replace(/\s/g, ""))) {
            return res.status(400).json({ message: "Name must contain only letters" });
        }

        // Convert gender to lowercase and validate
        let formattedGender = gender ? gender.toLowerCase() : null;
        if (formattedGender && !["male", "female", "other"].includes(formattedGender)) {
            return res.status(400).json({ message: "Gender must be 'male', 'female', or 'other'" });
        }

        const author = await Author.findByPk(id);
        if (!author) return res.status(400).json({ message: "Author not found" });

        if (name) author.name = name;
        if (formattedGender) author.gender = formattedGender;

        await author.save();
        res.status(200).json({ message: "Author updated successfully", author });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// List All Authors API
const listAuthors = async (req, res) => {
    try {
        let { name, page, limit } = req.query;

        // Validate and set default pagination values
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;
        const offset = (page - 1) * limit;

        // Build filters
        const filters = {};
        if (name) {
            filters.name = { [Op.iLike]: `%${name}%` };
        }

        // Fetch authors with filters and pagination
        const authors = await Author.findAll({
            where: filters,
            limit,
            offset,
            order: [["name", "ASC"]], // Sorted by name
        });

        const totalCount = await Author.count({ where: filters });

        if (authors.length === 0) {
            return res.status(400).json({ message: "No authors found" });
        }
        const data = {
            totalCount,
            authors,
        };

        res.status(200).json({ message: "Authors retrieved successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Author API
const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID
        if (!validator.isUUID(id)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }
        // Find the author (including soft-deleted ones if needed)
        const author = await Author.findByPk(id);
        if (!author) return res.status(400).json({ message: "Author not found" });

        // Soft delete books associated with this author (if books should also be soft deleted)
        await Book.destroy({ where: { author_id: author.id } });

        // Soft delete the author
        await author.destroy(); 

        res.status(200).json({ message: "Author deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    addAuthor,
    updateAuthor,
    listAuthors,
    deleteAuthor,
};
