const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false, 
    }
);

const User = require("./user")(sequelize, DataTypes);
const Book = require("./book")(sequelize, DataTypes);
const Author = require("./author")(sequelize, DataTypes);

// Define associations
Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });

module.exports = { sequelize, Sequelize, User, Book, Author };
