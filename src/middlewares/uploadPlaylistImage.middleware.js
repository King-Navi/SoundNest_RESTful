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

const ALLOWED_MIME = {
  "image/jpeg": ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

const fileFilter = (req, file, cb) => {
  const allowed = Object.keys(ALLOWED_MIME);
  if (allowed.includes(file.mimetype)) {
    if (process.env.ENVIROMENT== "development") {
      console.log(file.mimetype);      
    }
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
    const ext = ALLOWED_MIME[file.mimetype];
    if (!ext) {
      return cb(new Error("Unsupported file type"));
    }
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
