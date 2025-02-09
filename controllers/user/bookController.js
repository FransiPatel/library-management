const { Book, Author } = require("../../models");
const { Op } = require("sequelize");
require("dotenv").config();
const validator = require("validator");

const listBooks = async (req, res) => {
    try {
        let { search, start_date, end_date, page, limit } = req.query;

        // Validate pagination
                page = page && validator.isInt(page, { min: 1 }) ? parseInt(page) : 1;
                limit = limit && validator.isInt(limit, { min: 1 }) ? parseInt(limit) : 5;
                const offset = (page - 1) * limit;
        
                const filters = {};
                if (search) filters.title = { [Op.iLike]: `%${search}%` };
        
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
        res.status(500).json({ message: "Server error"});
    }
};

module.exports = {
    listBooks,
};
