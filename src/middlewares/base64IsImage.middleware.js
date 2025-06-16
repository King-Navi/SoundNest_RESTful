const { Buffer } = require("buffer");

/**
 * Middleware to validate that the `imageBase64` field in the request body contains a valid base64-encoded image.
 *
 * Expected format:
 * 
 *   data:image/{png|jpeg|jpg|webp|heic|heif};base64,<base64-data>
 *
 * This middleware performs the following validations:
 *
 * 1. Ensures `imageBase64` exists and is a string.
 * 2. Validates the MIME type and structure using a regular expression.
 * 3. Decodes the base64 content and checks for valid magic bytes (file signature) based on the specified MIME type:
 *    - PNG  → Starts with 0x89 0x50 0x4E 0x47
 *    - JPEG → Starts with 0xFF 0xD8 0xFF
 *    - WEBP → Starts with "RIFF" and contains "WEBP" at bytes 8–11
 *    - HEIC/HEIF → Contains "ftyp" at bytes 4–7
 *
 * If any validation fails, the request is rejected with HTTP 400 and an appropriate message.
 * Otherwise, the request proceeds to the next middleware.
 *
 * Example error responses:
 * - 400 Missing or invalid imageBase64 field
 * - 400 Invalid base64 encoding
 * - 400 The base64 content does not match the declared image type
 */

function validateImageBase64Format(req, res, next) {
  const { imageBase64 } = req.body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return res
      .status(400)
      .json({ message: "Missing or invalid imageBase64 field." });
  }

  const match = imageBase64.match(/^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,(.+)$/);

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

  let isValidMagic = false;
  switch (mimeType) {
    case "png":
      isValidMagic =
        buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      break;
    case "jpg":
    case "jpeg":
      isValidMagic = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      break;
    case "webp":
      isValidMagic =
        buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer.slice(8, 12).toString() === "WEBP";
      break;
    case "heic":
    case "heif":
      isValidMagic = buffer.slice(4, 8).toString() === "ftyp";
      break;
  }


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
