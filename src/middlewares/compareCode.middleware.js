const { verifyConfirmationCode } = require("../service/codeEmail.service");
const ConfirmationReasons = require("../utils/enums/confirmationReasons");

/**
 * Middleware to validate a user-provided confirmation code against a stored value.
 *
 * Expects `email` and `code` fields in the request body.  
 * The `code` is cast to string and verified using `verifyConfirmationCode(email, code)`.
 *
 * If either `email` or `code` is missing → 400 Bad Request  
 * If the code is invalid or expired       → 400 Bad Request with reason
 * On success, the request proceeds to the next middleware.
 *
 * Expected `verifyConfirmationCode` result format:
 *   {
 *     valid: boolean,
 *     reason?: string
 *   }
 */

function compareCodeMiddleware(req, res, next) {
  const { email, code } = req.body;

  if (!email || code === undefined || code === null) {
    return res.status(400).json({ error: "Email and code are required" });
  }
  const codeAsString = String(code);
  const result = verifyConfirmationCode(email, codeAsString);

  if (!result.valid) {
    return res.status(400).json({
      error:
        "Code not valid: " + (result.reason || ConfirmationReasons.INVALID),
    });
  }

  next();
}

module.exports = compareCodeMiddleware;
