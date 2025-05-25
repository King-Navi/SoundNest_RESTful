const { Buffer } = require("buffer");

/**
 * Middleware to verify that imageBase64 is a valid image (not PDF or other).
 */
function validateImageBase64Format(req, res, next) {
  const { imageBase64 } = req.body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return res
      .status(400)
      .json({ message: "Missing or invalid imageBase64 field." });
  }

  const match = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);

  if (!match) {
    return res
      .status(400)
      .json({
        message:
          "imageBase64 must be a valid base64-encoded PNG or JPEG image.",
      });
  }

  const mimeType = match[1];
  const base64Data = match[2];

  let buffer;
  try {
    buffer = Buffer.from(base64Data, "base64");
  } catch (e) {
    return res.status(400).json({ message: "Invalid base64 encoding." });
  }
  const magicNumbers = {
    png: [0x89, 0x50, 0x4e, 0x47],
    jpg: [0xff, 0xd8, 0xff],
    jpeg: [0xff, 0xd8, 0xff],
  };

  const expectedMagic = magicNumbers[mimeType];

  if (!expectedMagic) {
    return res.status(400).json({ message: "Unsupported image format." });
  }

  const isValidMagic = expectedMagic.every(
    (byte, index) => buffer[index] === byte
  );

  if (!isValidMagic) {
    return res
      .status(400)
      .json({
        message: "The base64 content does not match the declared image type.",
      });
  }

  next();
}

module.exports = validateImageBase64Format;
