const { verifyJwtToken } = require("../service/jwt.service");

/**
 * Middleware to authenticate requests using a JWT in the Authorization header.
 *
 * Expected format: Authorization: Bearer <token>
 *
 * The JWT is decoded and validated. If valid, the user payload is attached to `req.user`.
 * The decoded token is expected to contain the following 4 fields:
 *
 * - `id`       → User ID
 * - `username` → Name of the user
 * - `email`    → User's email address
 * - `role`     → User's role or permission level
 *
 * If the token is missing, malformed, invalid, or expired, the request is rejected.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwtToken(token);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("[verifyToken] Token verification error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
