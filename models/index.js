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

const User = require("./userModel")(sequelize, DataTypes);
const Book = require("./bookModel")(sequelize, DataTypes);
const Author = require("./authorModel")(sequelize, DataTypes);

// Define associations
Author.hasMany(Book, { foreignKey: "author_name" });
Book.belongsTo(Author, { foreignKey: "author_name" });

module.exports = { sequelize, Sequelize, User, Book, Author };
