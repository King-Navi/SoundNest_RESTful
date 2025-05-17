require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const RestClient = require("./externCommunication");

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
    this.restClient = new RestClient();
  }
  async moveTempImage(tempPath, fileName) {
    const targetPath = path.join(this.imageDir, fileName);

    try {
      await fs.rename(tempPath, targetPath);
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

  async requestRemoteDeleteSong(idSong) {
    try {
      const response = await this.restClient.delete(`/delete/song/${idSong}`);
      console.log(`Song ${idSong} deleted remotely`);
      return true;
    } catch (err) {
      console.error(
        `CRITICAL: Failed to delete song ${idSong} remotely:`,
        err.message
      );
      return false;
    }
  }
}

module.exports = FileManager;
