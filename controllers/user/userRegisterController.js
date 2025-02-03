const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const path = require("path");
const { User } = require("../../models"); 
require("dotenv").config();

// Registration Controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists using Sequelize
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({
            name: username,
            email: email,
            password: hashedPassword,
        });

        // Send confirmation email after registration
        sendConfirmationEmail(newUser.email, newUser.name);
        res.status(201).json({
            message: "User registered successfully. Please check your email for confirmation.",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Function to send confirmation email  
const sendConfirmationEmail = async (email, username) => {
    try {
        // Create a transporter object using SMTP (Nodemailer)
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS,
            },
        });

        // Render the EJS email template
        const emailTemplate = await ejs.renderFile(path.join(__dirname, '../../views/confirmationEmail.ejs'), {
            email: email,
            name: username,
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
                return res.status(550).json({ message: "Failed to send email", error: error.message });
            } else {
                return res.status(200).json({ message: "Email sent successfully", response: info.response });
            }
        });
        
    } catch (error) {
        res.status(550).json({ message: "Failed to send email", error: error.message })
    }
};

module.exports = {
    registerUser,
};
