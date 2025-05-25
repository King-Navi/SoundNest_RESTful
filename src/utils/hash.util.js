const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePasswords(plainText, hashedPassword) {
  return await bcrypt.compare(plainText, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePasswords,
};
