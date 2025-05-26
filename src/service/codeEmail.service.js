const nodemailer = require("nodemailer");
const ConfirmationReasons = require("../utils/enums/confirmationReasons");
const transporter = require("../config/emailConfig");
const { EmailAlreadySend } = require("../service/exceptions/exceptions");

const {
  setCode,
  getCode,
  deleteCode,
  hasCode,
} = require("./codeStore.service");

const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;

async function sendConfirmationCode(email) {
  if (!email) {
    throw new Error(
      "[codeEmail.service.js]:sendConfirmationCode No recipient email provided"
    );
  }
  if (getCode(email)) {
    throw new EmailAlreadySend(
      "A code was already sent to this email. Please wait or verify it."
    );
  }
  function generateAlphanumericCode(length = 6) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  let code;
  let attempts = 0;
  do {
    code = generateAlphanumericCode(6);
    attempts++;
    if (attempts > 10) {
      throw new Error("Unable to generate unique confirmation code");
    }
  } while (hasCode(code));

  setCode(email, code);
  setTimeout(() => deleteCode(email), 5 * 60 * 1000);
  await transporter.sendMail({
    from: EMAIL_ACCOUNT,
    to: email,
    subject: "Your confirmation code",
    text: `Your confirmation code is: ${code}`,
  });
  if (process.env.ENVIROMENT == "development") {
    console.debug(`[DEBUG] Confirmation code for ${email}: ${code}`);
  }
  return true;
}

/**
 * Check if the confirmation code sent by email is valid & delete the code.
 *
 * @param {string} email
 * @param {string|number} code
 * @returns {{ valid: boolean, reason: string }}
 * @see getCode
 * @see deleteCode
 */
function verifyConfirmationCode(email, code) {
  if (process.env.ENVIROMENT == "development") {
    console.debug(`[DEBUG] Verifying code for ${email}: ${code}`);
  }
  const stored = getCode(email);

  if (!stored)
    return { valid: false, reason: ConfirmationReasons.EXPIRED_OR_NOT_FOUND };
  if (String(stored.code) !== String(code))
    return { valid: false, reason: ConfirmationReasons.INVALID };

  deleteCode(email);
  return { valid: true, reason: ConfirmationReasons.SUCCESS };
}

module.exports = {
  sendConfirmationCode,
  verifyConfirmationCode,
};
