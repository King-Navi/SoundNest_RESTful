const AdditionalInfo = require("../modelsMongo/AdditionalInfo");
const userRepository = require("../repositories/user.repository");
const validator = require("validator");
const {
  EmailAlreadyExist,
  UserNameAlreadyExist,
  NonexistentAditionalInformation,
} = require("../utils/exceptions/user.exception");
const { ValidationError } = require("../utils/exceptions/validation.exception");
const { hashPassword } = require("../utils/hash.util");
const NoChangesError = require("../repositories/exceptions/noChangesError");
const additionalInfoRepository = require("../repositories/additionalInfo.mongo.repository");
const ID_LISTENER = 1;
const MAX_PASSWORD_LENGTH = 256;
const MAX_USERNAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;

async function getAditionalInfoUserService(id) {
  const exists = await additionalInfoRepository.hasAdditionalInformation(id);
  if (!exists) {
    throw new NonexistentAditionalInformation(
      "No additional information found for this user."
    );
  }
  const result = await additionalInfoRepository.getAdditionalInformation(id);
  return { info: result.info };
}

async function editPassword(userId, newPassword) {
  const user = await getUserById(userId);
  if (!user) {
    throw new ValidationError("User not found");
  }

  const hashed = await hashPassword(newPassword);
  await userRepository.updateUserById(userId, { password: hashed });
}

async function editPasswordByEmail(email, newPassword) {
  const hashed = await hashPassword(newPassword);
  await userRepository.updateUserPasswordByEmail(email, hashed);
}

async function registerUser({
  nameUser,
  email,
  password,
  additionalInformation,
}) {
  if (!nameUser || nameUser.length > MAX_USERNAME_LENGTH) {
    throw new ValidationError(
      `Username must be less than ${MAX_USERNAME_LENGTH} characters`
    );
  }

  if (!email || email.length > MAX_EMAIL_LENGTH || !validator.isEmail(email)) {
    throw new ValidationError("Invalid email format");
  }

  if (!password || password.length > MAX_PASSWORD_LENGTH) {
    throw new ValidationError(
      `Password must be less than ${MAX_PASSWORD_LENGTH} characters`
    );
  }

  const existingUserByEmail = await userRepository.findUserByEmail(email);
  if (existingUserByEmail) {
    throw new EmailAlreadyExist();
  }

  const existingUserByName = await userRepository.findUserByName(nameUser);
  if (existingUserByName) {
    throw new UserNameAlreadyExist();
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await userRepository.createUser({
    nameUser,
    email,
    password: hashedPassword,
    idRole: ID_LISTENER,
  });

  if (additionalInformation) {
    await AdditionalInfo.create({
      userId: newUser.idUser,
      info: additionalInformation,
    });
  }

  return newUser;
}

async function updateUser(userId, updateData) {
  const filteredData = {};
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined && updateData[key] !== null) {
      filteredData[key] = updateData[key];
    }
  });
  if ("password" in filteredData) {
    delete filteredData.password;
  }
  let updatedUser;

  try {
    updatedUser = await userRepository.updateUserById(userId, filteredData);
  } catch (err) {
    if (!(err instanceof NoChangesError)) throw err;
  }

  if ("additionalInformation" in filteredData) {
    await additionalInfoRepository.saveAdditionalInformation(
      userId,
      filteredData.additionalInformation
    );
  }

  return updatedUser;
}

/**
 * Retrieve a user by its ID, sanitize the result by removing the password field,
 * and return a plain object or null if the user does not exist.
 *
 * @async
 * @function getUserById
 * @param {number} userId – The unique identifier of the user to retrieve.
 * @returns {Promise<{
 *   idUser: number,
 *   nameUser: string,
 *   email: string,
 *   idRole: number
 * } | null>}
 *   Resolves to an object with the following properties (password is omitted):
 *   - **idUser**: numeric database primary key
 *   - **nameUser**: the user's username
 *   - **email**: the user's email address
 *   - **idRole**: the role ID assigned to the user
 *   Or `null` if no user is found.
 * @throws {ValidationError}
 *   If `userId` is missing or falsy.
 * @throws {Error}
 *   If an unexpected error occurs when fetching from the database.
 */
async function getUserById(userId) {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }
  const userInstance = await userRepository.findUserById(userId);
  if (!userInstance) return null;

  const user = userInstance.get({ plain: true });
  delete user.password;

  return user;
}

module.exports = {
  registerUser,
  updateUser,
  getUserById,
  editPassword,
  getAditionalInfoUserService,
  editPasswordByEmail,
};
