module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
      name: { type: DataTypes.STRING, primaryKey: true },
      gender: DataTypes.STRING,
  });

  Author.beforeDestroy(async (author, options) => {
      await sequelize.models.Book.update(
          { author_name: "Unknown" },
          { where: { author_name: author.name } }
      );
  });

  return Author;
};
