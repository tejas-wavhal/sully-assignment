const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authenticated, token missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    // Fetch the user from the decoded token's id
    const user = await User.findById(decoded.id).select("-password"); // Fetch user without password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to the request
    req.user = user;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
