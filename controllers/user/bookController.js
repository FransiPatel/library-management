const { Book } = require("../../models");  // Assuming you have a Book model
const { Op } = require("sequelize");  // Sequelize operators
require("dotenv").config();

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
            books
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    listBooks,
};
