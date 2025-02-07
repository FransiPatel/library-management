const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuidv4 },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.TEXT, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "user", validate: { isIn: [["admin", "user"]] } },
    },{ tableName: "Users"});
  
    return User;
  };
  