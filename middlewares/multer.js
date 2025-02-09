const multer = require("multer");
const path = require("path");

// Allowed file types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "media/coverpage/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

// File filter function to validate MIME type
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, JPEG, and PNG files are allowed."), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter,
}).single("cover_image");

module.exports = upload;
