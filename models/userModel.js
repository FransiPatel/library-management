module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.TEXT, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "user", validate: { isIn: [["admin", "user"]] } },
    });
  
    return User;
  };
  