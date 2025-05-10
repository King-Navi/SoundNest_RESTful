const { verifyJwtToken } = require('../service/jwtService');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJwtToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[verifyToken] Token verification error:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};


module.exports = verifyToken;
