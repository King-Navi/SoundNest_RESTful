require("dotenv").config();
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class FileManager {
  /**
   * @param {'SONGS_IMAGE_PATH_JS' | 'PLAYLIST_IMAGE_PATH_JS'} envVarName
   */
  constructor(envVarName) {
    const dirPath = process.env[envVarName];
    if (!dirPath) {
      throw new Error(`Environment variable is not defined`);
    }
    this.imageDir = path.resolve(process.cwd(), dirPath);
  }
  async moveTempImage(tempPath, fileName) {
    const targetPath = path.join(this.imageDir, fileName);
    if (tempPath === targetPath) {
      return targetPath;
    }
    try {
      await fs.move(tempPath, targetPath, { overwrite: true });
      return targetPath;
    } catch (err) {
      if (process.env.ENVIROMENT === "development") {
        console.error(`[moveTempImage] Failed to move image: ${err.message}`);
      }
      throw err;
    }
  }

  async deleteImage(fileName, extension) {
    const fullPath = path.join(this.imageDir, `${fileName}.${extension}`);
    try {
      await fs.unlink(fullPath);
      return true;
    } catch (err) {
      if (err.code === "ENOENT") {
        if (process.env.ENVIROMENT === "development") {
          console.warn(`Imagen no encontrada (omitido): ${fullPath}`);
        }
        return false;
      }
      if (process.env.ENVIROMENT === "development") {
        console.error(`Error eliminando imagen ${fullPath}:`, err.message);
      }
      throw err;
    }
  }

  async saveImageFromBase64(imageBase64) {
    const match = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image base64 format");
    }

    const extension = match[1];
    const base64Data = match[2];
    const fileName = `${Date.now()}-${uuidv4()}.${extension}`;
    const fullPath = path.join(this.imageDir, fileName);

    await fs.mkdir(this.imageDir, { recursive: true });
    await fs.writeFile(fullPath, base64Data, { encoding: "base64" });

    return { fileName, path: fullPath };
  }
  async saveImageFromBase64(imageBase64, fileNameOverride) {
    const match = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!match) throw new Error("Invalid image base64 format");

    const extension = match[1];
    const base64Data = match[2];
    const fileName =
      fileNameOverride || `${Date.now()}-${uuidv4()}.${extension}`;
    const fullPath = path.join(this.imageDir, fileName);
    await fs.mkdir(this.imageDir, { recursive: true });
    await fs.writeFile(fullPath, base64Data, { encoding: "base64" });
    const exists = await fs
      .access(fullPath)
      .then(() => true)
      .catch(() => false);
    return { fileName, path: fullPath };
  }
}

module.exports = FileManager;
