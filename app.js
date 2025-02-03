const express = require("express");
const adminRoutes = require("./routes/admin/admin");
const bookRoutes = require("./routes/admin/book");
const authorRoutes = require("./routes/admin/author");
const userRoutes = require("./routes/user/user");
const bodyParser=require('body-parser');

require("dotenv").config();
const { sequelize } = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin Routes
app.use("/admin", adminRoutes);
app.use("/admin", bookRoutes);
app.use("/admin", authorRoutes);

// User Routes
app.use("/", userRoutes);

// Sync Database and Start Server
const PORT = process.env.PORT || 3000;
sequelize
    .sync() // Sync models with database
    .then(() => {
        console.log("Database connected and models synced");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
