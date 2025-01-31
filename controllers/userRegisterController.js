const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const path = require("path");
const pool = require("../config/db");
require("dotenv").config();

// Registration Controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the new user in the database 
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        // Send confirmation email after registration
        const user = result.rows[0];
        sendConfirmationEmail(user.email, user.name);

        res.status(201).json({
            message: "User registered successfully. Please check your email for confirmation.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Function to send confirmation email  
const sendConfirmationEmail = async (email,username) => {
    try {
        // Create a transporter object using SMTP (Nodemailer)
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS
            }
        });

        // Render the EJS email template
        const emailTemplate = await ejs.renderFile(path.join(__dirname, '../emailTemplates/confirmationEmail.ejs'), {
            email: email,
            name: username
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Platform',
            html: emailTemplate,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.error('Error in sending email:', error);
    }
};

module.exports = {
    registerUser,
};
