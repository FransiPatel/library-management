const pool = require("../config/db"); 

// Add Author Controller
const addAuthor = async (req, res) => {
    try {
        const { name, gender } = req.body;

        // Check if author already exists
        const existingAuthor = await pool.query(
            "SELECT * FROM authors WHERE name = $1",
            [name]
        );

        if (existingAuthor.rows.length > 0) {
            return res.status(409).json({ message: "Author already exists" });
        }

        // Insert new author into the database
        const result = await pool.query(
            "INSERT INTO authors (name, gender) VALUES ($1, $2) RETURNING *",
            [name, gender]
        );

        res.status(201).json({
            message: "Author added successfully",
            author: result.rows[0],
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
        const existingAuthor = await pool.query(
            "SELECT * FROM authors WHERE name = $1",
            [name]
        );

        if (existingAuthor.rows.length === 0) {
            return res.status(404).json({ message: "Author not found" });
        }

        // Update author details
        const result = await pool.query(
            "UPDATE authors SET gender = $1 WHERE name = $2 RETURNING *",
            [gender, name]
        );

        res.status(200).json({
            message: "Author updated successfully",
            author: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// List All Authors Controller
const listAuthors = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM authors");

        res.status(200).json({
            message: "Authors retrieved successfully",
            authors: result.rows,
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
        const result = await pool.query(
            "SELECT * FROM authors WHERE name ILIKE $1",
            [`%${name}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No authors found" });
        }

        res.status(200).json({
            message: "Authors retrieved successfully",
            authors: result.rows,
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
        const existingAuthor = await pool.query(
            "SELECT * FROM authors WHERE name = $1",
            [name]
        );

        if (existingAuthor.rows.length === 0) {
            return res.status(404).json({ message: "Author not found" });
        }

        // Delete the author from the database
        await pool.query("DELETE FROM authors WHERE name = $1", [name]);

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
