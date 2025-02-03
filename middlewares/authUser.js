const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(498).json({ message: "Token is not valid" });
    }
};

module.exports = authenticateUser;
