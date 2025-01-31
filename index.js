const express = require("express");
const adminRoutes = require("./routes/admin");
const bookRoutes = require("./routes/book");
const authorRoutes = require("./routes/author");
const userRoutes = require("./routes/user");

require("dotenv").config();

const app = express();
app.use(express.json());

// Admin Routes
app.use("/admin", adminRoutes);
app.use("/admin", bookRoutes);
app.use("/admin", authorRoutes);
app.use("/",userRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
