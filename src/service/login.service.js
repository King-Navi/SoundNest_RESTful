const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const { comparePasswords } = require("../utils/hash.util");
const { ValidationError } = require("../utils/exceptions/validation.exception");
const {generateToken } = require("../service/jwt.service")
async function loginService({ username, password }) {
  const user = await userRepository.findUserByName(username);

  if (!user) {
    throw new ValidationError("User not found");
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new ValidationError("Invalid credentials");
  }

  const token = generateToken(user);

  return { token };
}

module.exports = {
  loginService,
};
