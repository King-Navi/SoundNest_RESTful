const userService = require("../service/user.service");
const codeService = require("../service/codeEmail.service")
const HttpError = require("../utils/exceptions/httpError");

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

    console.error("Internal Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function sendCode(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    await codeService.sendConfirmationCode(email);
    res.status(200).json({ message: "Code sent successfully" });
  } catch (err) {
    console.error("Error sending code:", err);
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
    console.error("Error comparing code:", err);
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

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('[editUser] Error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}


module.exports = {
  registerUser,
  sendCode,
  compareCode,
  editUser
};
