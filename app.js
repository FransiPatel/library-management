const express = require("express");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const bodyParser = require("body-parser");

require("dotenv").config();
const { sequelize } = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin Routes
app.use("/admin", adminRoutes);

// User Routes
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await sequelize.sync(); // Await the database sync
        console.log("Database connected and models synced");

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};
// Start the server
startServer();