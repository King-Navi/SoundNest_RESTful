const jwt = require('jsonwebtoken');

const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.idUser,
      username: user.nameUser,
      email: user.email,
      role: user.idRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "23h" }
  );
}
module.exports = { generateToken, verifyJwtToken };
