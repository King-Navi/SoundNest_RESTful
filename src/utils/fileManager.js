require("dotenv").config();
const fs = require("fs-extra");
const path = require("path");

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

    try {
      await fs.move(tempPath, targetPath, { overwrite: true });
      return targetPath;
    } catch (err) {
      console.error(`[moveTempImage] Failed to move image: ${err.message}`);
      throw err;
    }
  }

  async deleteImage(fileName, extension) {
    const fullPath = path.join(this.imageDir, `${fileName}.${extension}`);
    try {
      await fs.unlink(fullPath);
      console.log(`Imagen eliminada: ${fullPath}`);
      return true;
    } catch (err) {
      if (err.code === "ENOENT") {
        console.warn(`Imagen no encontrada (omitido): ${fullPath}`);
        return false;
      }
      console.error(`Error eliminando imagen ${fullPath}:`, err.message);
      throw err;
    }
  }
}

module.exports = FileManager;
