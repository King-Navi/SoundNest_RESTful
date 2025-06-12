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
