const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "your_jwt_secret", // Secret key
    { expiresIn: "1h" } // Token expiration time
  );
};

module.exports = generateToken;
