const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { comparePasswords } = require("../utils/hash.util");
const { ValidationError } = require("../utils/exceptions/validation.exception");

async function loginService({ username, password }) {
  const user = await userRepository.findUserByName(username);

  if (!user) {
    throw new ValidationError("User not found");
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new ValidationError("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.idUser,
      username: user.nameUser,
      email: user.email,
      role: user.idRole,
    },
    process.env.JWT_SECRET,
    { expiresIn: "23h" }
  );

  return { token };
}

module.exports = {
  loginService,
};
