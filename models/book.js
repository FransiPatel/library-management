const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
      id: {
          type: DataTypes.UUID,
          defaultValue: uuidv4,
          primaryKey: true,
      },
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: DataTypes.TEXT,
      publication: DataTypes.DATE,
      cover_image: DataTypes.STRING,
      author_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
              model: "Authors",
              key: "id",
          },
      },
  },{ 
    tableName: "Books",
    timestamps: true, 
    paranoid: true,
    deletedAt: "deletedAt",
});

  Book.associate = (models) => {
      Book.belongsTo(models.Author, {
          foreignKey: "author_id",
          onDelete: "CASCADE",
      });
  };

  return Book;
};
