const express = require("express");
const adminRoutes = require("./routes/admin/admin");
const bookRoutes = require("./routes/admin/book");
const authorRoutes = require("./routes/admin/author");
const userRoutes = require("./routes/user/user");

require("dotenv").config();
const { sequelize } = require("./models"); // Import Sequelize instance

const app = express();
app.use(express.json());

// Admin Routes
app.use("/admin", adminRoutes);
app.use("/admin", bookRoutes);
app.use("/admin", authorRoutes);
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
