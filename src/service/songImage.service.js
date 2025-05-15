const path = require("path");
const fs = require("fs/promises");
const SongRepository = require("../repositories/song.repository");
const SongPhotoRepository = require("../repositories/songPhoto.repository");

async function updateSongImage(songId, fileName, tmpDirPath) {
  const ext = path.extname(fileName);
  if (!ext) throw new Error("Extensión de archivo inválida");
  const extension = ext.slice(1).toLowerCase();
  const baseName = `song-${songId}`;
  const finalFileName = `${baseName}.${extension}`;
  const tempFilePath = path.join(tmpDirPath, fileName);
  const finalPath = path.join(process.env.SONGS_IMAGE_PATH_JS, finalFileName);

  const song = await SongRepository.getSongById(songId);
  if (!song) throw new Error("Canción no encontrada");

  const existingPhoto = await SongPhotoRepository.getBySongId(songId);

  if (existingPhoto) {
    await SongPhotoRepository.update(existingPhoto.idSongPhoto, baseName, extension);
  } else {
    await SongPhotoRepository.create(baseName, extension, songId);
  }
  await fs.mkdir(path.dirname(finalPath), { recursive: true });
  await fs.rename(tempFilePath, finalPath);
  await fs.rm(tmpDirPath, { recursive: true, force: true });
}

module.exports = {
  updateSongImage,
};
