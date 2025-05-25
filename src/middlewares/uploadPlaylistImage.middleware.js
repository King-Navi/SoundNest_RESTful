const multer = require("multer");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const uploadDir = process.env.PLAYLIST_IMAGE_PATH_JS;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png and .jpg images are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });
    req._tmpDirPath = tmpDir.name;
    cb(null, tmpDir.name);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    req._uploadedFileName = uniqueName;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB MAX
});

module.exports = upload;
