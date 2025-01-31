const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Login Controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the user's email and password
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = userResult.rows[0];

        // Compare the password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.name, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } 
        );

        // Send the token back to the user
        res.status(200).json({
            message: "Login successful",
            token: token,  // Send JWT token
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    loginUser,
};
