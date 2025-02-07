const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
      id: {
          type: DataTypes.UUID,
          defaultValue: uuidv4,
          primaryKey: true,
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      gender: DataTypes.STRING,
  },{
    tableName: "Authors",
    timestamps: true, 
    paranoid: true,
    deletedAt: "deletedAt",
});

  return Author;
};
