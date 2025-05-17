const userService = require("../service/user.service");
const codeService = require("../service/codeEmail.service");
const HttpError = require("../utils/exceptions/httpError");
const { EmailAlreadySend } = require("../service/exceptions/exceptions");
const { verifyConfirmationCode } = require("../service/codeEmail.service");
const { ValidationError } = require("../utils/exceptions/validation.exception");
const ConfirmationReasons = require("../utils/enums/confirmationReasons");

const NAME_FILE = "user.controller.js";

async function editUserPasswordController(req, res) {
  try {
    const { code, newPassword } = req.body;
    const { email, id } = req.user;

    const result = verifyConfirmationCode(email, code);
    if (!result.valid) {
      const message =
        result.reason === ConfirmationReasons.EXPIRED_OR_NOT_FOUND
          ? "Code expired or not found"
          : "Invalid code";

      const status =
        result.reason === ConfirmationReasons.EXPIRED_OR_NOT_FOUND ? 428 : 400;

      return res.status(status).json({ error: message });
    }

    await userService.editPassword(id, newPassword);
    res.status(204).send();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(404).json({ error: err.message });
    }

    console.error("[editUserPasswordController] Error:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
}

async function registerUser(req, res) {
  try {
    const { nameUser, email, password, additionalInformation } = req.body;
    await userService.registerUser({
      nameUser,
      email,
      password,
      additionalInformation,
    });

    res.status(204).send();
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(`[${NAME_FILE}][registerUser] Internal Server Error:`, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendCode(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    await codeService.sendConfirmationCode(email);
    res.status(200).json({ message: "Code sent successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof EmailAlreadySend) {
      return res.status(400).json({ error: err.message });
    }
    console.error(`[${NAME_FILE}][sendCode] Error:, ${err}`);

    res.status(500).json({ error: "Failed to send code" });
  }
}

/**
 * Controller to verify a confirmation code sent to the user's email.
 *
 * @async
 * @function compareCode
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 * @see codeService.verifyConfirmationCode
 * @see ConfirmationReasons
 */
async function compareCode(req, res) {
  try {
    const { email, code } = req.body;
    const result = codeService.verifyConfirmationCode(email, code);

    if (!result.valid) {
      const message =
        result.reason === ConfirmationReasons.EXPIRED_OR_NOT_FOUND
          ? "Code expired or not found"
          : "Invalid code";
      return res.status(400).json({ error: message });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (err) {
    console.error(`[${NAME_FILE}][compareCode] Error:, ${err}`);
    res.status(500).json({ error: "Failed to verify code" });
  }
}

async function editUser(req, res) {
  try {
    const userId = req.user.id;
    const { nameUser, email, password, additionalInformation } = req.body;

    const updatedUser = await userService.updateUser(userId, {
      nameUser,
      email,
      password,
      additionalInformation,
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(`[${NAME_FILE}][editUser] Error:, ${err}`);
    res.status(500).json({ error: "Failed to update user" });
  }
}

async function recoverUser(req, res) {
  try {
    const userId = req.user.id;
    const recoveredUser = await userService.getUserById(userId);

    res.status(200).json(recoveredUser);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(`[${NAME_FILE}][recoverUser] Error:, ${err}`);
    res.status(500).json({ error: "Failed to validate user" });
  }
}

module.exports = {
  registerUser,
  sendCode,
  compareCode,
  editUser,
  recoverUser,
  editUserPasswordController,
};
