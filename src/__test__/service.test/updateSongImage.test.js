jest.mock("../../repositories/song.repository", () => ({
  getSongById: jest.fn(),
}));
jest.mock("../../repositories/songPhoto.repository", () => ({
  getBySongId: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
}));
jest.mock("fs/promises");

const { updateSongImage } = require("../../service/songImage.service");
const SongRepository = require("../../repositories/song.repository");
const SongPhotoRepository = require("../../repositories/songPhoto.repository");
const fs = require("fs/promises");
const path = require("path");

describe("updateSongImage", () => {
  const songId = 123;
  const fileName = "upload.png";
  const baseName = "upload";
  const tmpDirPath = "/tmp/dir";
  const extension = "png";
  const expectedFinalName = `song-${songId}.${extension}`;
  const baseExpectedFinalName = `song-${songId}`;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SONGS_IMAGE_PATH_JS = "/final/images";
  });

  test("debe lanzar error si el archivo no tiene extensión", async () => {
    await expect(
      updateSongImage(songId, "no_extension", tmpDirPath)
    ).rejects.toThrow("Extensión de archivo inválida");
  });

  test("debe lanzar error si la canción no existe", async () => {
    SongRepository.getSongById.mockResolvedValue(null);

    await expect(updateSongImage(songId, fileName, tmpDirPath)).rejects.toThrow(
      "Canción no encontrada"
    );
  });

  test("debe crear nueva imagen si no existe", async () => {
    SongRepository.getSongById.mockResolvedValue({ idSong: songId });
    SongPhotoRepository.getBySongId.mockResolvedValue(null);

    await updateSongImage(songId, fileName, tmpDirPath);

    expect(SongPhotoRepository.create).toHaveBeenCalledWith(
      baseExpectedFinalName,
      extension,
      songId,
    );

    expect(fs.rename).toHaveBeenCalledWith(
      path.join(tmpDirPath, fileName),
      path.join("/final/images", expectedFinalName)
    );

    expect(fs.rm).toHaveBeenCalledWith(tmpDirPath, {
      recursive: true,
      force: true,
    });
  });

  test("debe actualizar imagen existente si ya hay una", async () => {
    SongRepository.getSongById.mockResolvedValue({ idSong: songId });
    SongPhotoRepository.getBySongId.mockResolvedValue({ idSongPhoto: 999 });

    await updateSongImage(songId, fileName, tmpDirPath);

    expect(SongPhotoRepository.update).toHaveBeenCalledWith(
      999,
      baseExpectedFinalName,
      extension
    );

    expect(fs.rename).toHaveBeenCalled();
    expect(fs.rm).toHaveBeenCalled();
  });
});
