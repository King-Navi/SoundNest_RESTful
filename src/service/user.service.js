const AdditionalInfo = require("../modelsMongo/AdditionalInfo");
const userRepository = require("../repositories/user.repository");
const validator = require("validator");
const {
  EmailAlreadyExist,
  UserNameAlreadyExist,
} = require("../utils/exceptions/user.exception");
const { ValidationError } = require("../utils/exceptions/validation.exception");
const { hashPassword } = require("../utils/hash.util");
const NoChangesError = require("../repositories/exceptions/noChangesError");
const additionalInfoRepository = require('../repositories/additionalInfo.mongo.repository');

const ID_LISTENER = 1;
const MAX_PASSWORD_LENGTH = 256;
const MAX_USERNAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;

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
  
  let updatedUser;

  try {
    updatedUser = await userRepository.updateUserById(userId, filteredData);
  } catch (err) {
    if (!(err instanceof NoChangesError)) throw err;
  }

  if ('additionalInformation' in filteredData) {
    await additionalInfoRepository.saveAdditionalInformation(
      userId,
      filteredData.additionalInformation
    );
  }

  return updatedUser;
}

async function getUserById(userId) {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }
  try {
    const user = await userRepository.findUserById(userId);
    return user;

  } catch (error) {
    throw error
  }
}

module.exports = {
  registerUser,
  updateUser,
  getUserById,
};
