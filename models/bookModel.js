module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("Book", {
      title: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      publication: DataTypes.DATE,
      author_name: { type: DataTypes.STRING, allowNull: false },
      cover_image: DataTypes.STRING
    });
  
    Book.associate = (models) => {
      Book.belongsTo(models.Author, { foreignKey: "author_name", onDelete: "CASCADE" });
    };
  
    return Book;
  };
  