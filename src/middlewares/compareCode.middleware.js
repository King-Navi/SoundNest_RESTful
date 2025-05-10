const { verifyConfirmationCode } = require('../service/codeEmail.service');
const ConfirmationReasons = require('../utils/enums/confirmationReasons');

function compareCodeMiddleware(req, res, next) {
  const { email, code } = req.body;

  if (!email || code === undefined || code === null) {
    return res.status(400).json({ error: "Email and code are required" });
  }
  const codeAsString = String(code);
  const result = verifyConfirmationCode(email, codeAsString);

  if (!result.valid) {
    return res.status(400).json({
      error: "Code not valid: " + (result.reason || ConfirmationReasons.INVALID)
    });
  }

  next();
}

module.exports = compareCodeMiddleware;
