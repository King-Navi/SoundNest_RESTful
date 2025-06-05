jest.mock("../../repositories/songGenre.repository");
jest.mock("../../repositories/songExtension.repository");
jest.mock("../../repositories/song.repository");
jest.mock("../../repositories/songPhoto.repository");
jest.mock("../../messaging/deleteSong.producer");
jest.mock("../../repositories/visualization.repository");

const FileManager = require("../../utils/fileManager");

const songService = require("../../service/song.service");
const songGenreRepo = require("../../repositories/songGenre.repository");
const songExtensionRepo = require("../../repositories/songExtension.repository");
const songRepo = require("../../repositories/song.repository");
const songPhotoRepo = require("../../repositories/songPhoto.repository");
const visualizationRepo = require("../../repositories/visualization.repository");

const SongDescriptionRepository = require("../../repositories/songDescription.mongo.reposiroty");
const {
  BadRequestError,
} = require("../../repositories/exceptions/song.exceptions");
const { publishDeleteSong } = require("../../messaging/deleteSong.producer");



describe("song.service - getGenres", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should return genres from repository", async () => {
    const mockGenres = [{ id: 1, name: "Rock" }];
    songGenreRepo.getAllGenres.mockResolvedValue(mockGenres);

    const result = await songService.getGenres();
    expect(result).toEqual(mockGenres);
  });

  test("should throw if repository fails", async () => {
    songGenreRepo.getAllGenres.mockRejectedValue(new Error("DB error"));

    await expect(songService.getGenres()).rejects.toThrow("DB error");
  });
});

describe("song.service - getExtensions", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should return extensions from repository", async () => {
    const mockExt = [{ id: 1, name: ".mp3" }];
    songExtensionRepo.getAllExtension.mockResolvedValue(mockExt);

    const result = await songService.getExtensions();
    expect(result).toEqual(mockExt);
  });

  test("should throw if repository fails", async () => {
    songExtensionRepo.getAllExtension.mockRejectedValue(new Error("DB error"));

    await expect(songService.getExtensions()).rejects.toThrow("DB error");
  });
});

describe("song.service - updateDescriptionSongService", () => {
  afterEach(() => jest.restoreAllMocks());

  const validSongId = 10;
  const validUserId = 5;
  const validDescription = "New description";

  test("should throw BadRequestError for invalid songId", async () => {
    await expect(
      songService.updateDescriptionSongService("abc", 1, "desc")
    ).rejects.toThrow(BadRequestError);
  });

  test("should throw BadRequestError for invalid userId", async () => {
    await expect(
      songService.updateDescriptionSongService(1, -3, "desc")
    ).rejects.toThrow(BadRequestError);
  });

  test("should throw BadRequestError for empty description", async () => {
    await expect(
      songService.updateDescriptionSongService(1, 2, "   ")
    ).rejects.toThrow(BadRequestError);
  });

  test("should update if description exists", async () => {
    const updated = { description: validDescription };
    jest
      .spyOn(SongDescriptionRepository.prototype, "updateDescriptionBySongId")
      .mockResolvedValue(updated);

    const result = await songService.updateDescriptionSongService(
      validSongId,
      validUserId,
      validDescription
    );

    expect(result).toEqual(updated);
  });

  test("should create if no existing description is found", async () => {
    jest
      .spyOn(SongDescriptionRepository.prototype, "updateDescriptionBySongId")
      .mockResolvedValue(null);
    const created = { description: validDescription };
    jest
      .spyOn(SongDescriptionRepository.prototype, "create")
      .mockResolvedValue(created);

    const result = await songService.updateDescriptionSongService(
      validSongId,
      validUserId,
      validDescription
    );

    expect(result).toEqual(created);
  });
});

describe("song.service - deleteSongService", () => {
  afterEach(() => jest.restoreAllMocks());

  const mockDescRepo = SongDescriptionRepository.prototype;

  test("should throw if song does not exist", async () => {
    songRepo.getSongById.mockResolvedValue(null);

    await expect(songService.deleteSongService(999)).rejects.toThrow(
      "The song with ID 999 does not exist"
    );
  });

  test("should delete description and image and mark as deleted", async () => {
    songRepo.getSongById.mockResolvedValue({ idSong: 1 });
    jest.spyOn(mockDescRepo, "getBySongId").mockResolvedValue({ id: "desc1" });
    jest.spyOn(mockDescRepo, "deleteBySongId").mockResolvedValue(true);
    songPhotoRepo.getBySongPhotoId.mockResolvedValue({
      fileName: "a",
      extension: "jpg",
    });
    const mockDeleteImage = jest
  .spyOn(FileManager.prototype, "deleteImage")
  .mockResolvedValue(true);
    songPhotoRepo.deleteSongPhotoBySongId.mockResolvedValue(true);
    publishDeleteSong.mockResolvedValue(true);
    songRepo.updateSongSetDeleted.mockResolvedValue(true);

    const result = await songService.deleteSongService(1);

    expect(mockDeleteImage).toHaveBeenCalledWith("a", "jpg");
    expect(result).toEqual({ message: "Canción 1 eliminada correctamente" });
  });

  test("should throw if deleting description fails", async () => {
    songRepo.getSongById.mockResolvedValue({ idSong: 2 });
    jest.spyOn(mockDescRepo, "getBySongId").mockResolvedValue({ id: "desc2" });
    jest
      .spyOn(mockDescRepo, "deleteBySongId")
      .mockRejectedValue(new Error("DB fail"));

    await expect(songService.deleteSongService(2)).rejects.toThrow(
      "Error deleting description for song 2"
    );
  });

  test("should throw if audio deletion fails", async () => {
    songRepo.getSongById.mockResolvedValue({ idSong: 3 });
    jest.spyOn(mockDescRepo, "getBySongId").mockResolvedValue(null);
    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    publishDeleteSong.mockResolvedValue(false);

    await expect(songService.deleteSongService(3)).rejects.toThrow(
      "No se pudo eliminar el audio de la canción 3"
    );
  });
});


describe("song.service - getListSongsByIdsService", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should return [] si el arreglo es vacío o no es un array", async () => {
    expect(await songService.getListSongsByIdsService([])).toEqual([]);
    expect(await songService.getListSongsByIdsService(null)).toEqual([]);
  });

  test("should llamar getSongsByIds y formatear con formatSongList (implementación real)", async () => {
    const rawSongs = [
      {
        idSong: 1,
        songName: "A",
        fileName: "a.mp3",
        durationSeconds: 100,
        releaseDate: "2020-01-01",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        idAppUser_AppUser: { nameUser: "UserA" },
        toJSON() {
          return this;
        },
      },
      {
        idSong: 2,
        songName: "B",
        fileName: "b.mp3",
        durationSeconds: 200,
        releaseDate: "2021-02-02",
        isDeleted: false,
        idSongGenre: 2,
        idSongExtension: 2,
        idAppUser_AppUser: { nameUser: "UserB" },
        toJSON() {
          return this;
        },
      },
    ];

    songRepo.getSongsByIds.mockResolvedValue(rawSongs);

    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null); // sin foto
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(0);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "desc" });

    const result = await songService.getListSongsByIdsService([1, 2]);

    expect(songRepo.getSongsByIds).toHaveBeenCalledWith([1, 2]);
    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      idSong: 1,
      userName: "UserA",
      description: "desc",
      visualizations: 0,
      pathImageUrl: null,
    });
    expect(result[1]).toMatchObject({
      idSong: 2,
      userName: "UserB",
      description: "desc",
      visualizations: 0,
      pathImageUrl: null,
    });
  });
});

describe("song.service - searchSong", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should llamar getSongsByFilters con filtros correctos y formatear resultado", async () => {
    const rawSongs = [
      {
        idSong: 1,
        songName: "Song A",
        fileName: "a.mp3",
        durationSeconds: 120,
        releaseDate: "2020-03-03",
        isDeleted: false,
        idSongGenre: 3,
        idSongExtension: 1,
        idAppUser_AppUser: { nameUser: "ArtistA" },
        toJSON() {
          return this;
        },
      },
    ];

    songRepo.getSongsByFilters.mockResolvedValue(rawSongs);

    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(5);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "searchdesc" });

    const result = await songService.searchSong("name", "artist", 3, 10, 0);

    expect(songRepo.getSongsByFilters).toHaveBeenCalledWith(
      { songName: "name", artistName: "artist", idSongGenre: 3 },
      { limit: 10, offset: 0 }
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      idSong: 1,
      userName: "ArtistA",
      description: "searchdesc",
      visualizations: 5,
      pathImageUrl: null,
    });
  });
});

describe("song.service - getMostPopular", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should devolver [] si no hay IDs populares para ese mes/año", async () => {
    visualizationRepo.getTopSongIdsByMonth.mockResolvedValue([]);

    const result = await songService.getMostPopular(2023, 5, 10);
    expect(visualizationRepo.getTopSongIdsByMonth).toHaveBeenCalledWith(
      2023,
      5,
      10
    );
    expect(result).toEqual([]);
  });

  test("should ordenar según topIds y formatear con formatSongList (real)", async () => {
    const topIds = [3, 1, 2];
    const rawSongs = [
      {
        idSong: 1,
        songName: "One",
        fileName: "one.mp3",
        durationSeconds: 111,
        releaseDate: "2020-04-04",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        idAppUser_AppUser: { nameUser: "User1" },
        toJSON() {
          return this;
        },
      },
      {
        idSong: 2,
        songName: "Two",
        fileName: "two.mp3",
        durationSeconds: 222,
        releaseDate: "2020-05-05",
        isDeleted: false,
        idSongGenre: 2,
        idSongExtension: 2,
        idAppUser_AppUser: { nameUser: "User2" },
        toJSON() {
          return this;
        },
      },
      {
        idSong: 3,
        songName: "Three",
        fileName: "three.mp3",
        durationSeconds: 333,
        releaseDate: "2020-06-06",
        isDeleted: false,
        idSongGenre: 3,
        idSongExtension: 3,
        idAppUser_AppUser: { nameUser: "User3" },
        toJSON() {
          return this;
        },
      },
    ];

    visualizationRepo.getTopSongIdsByMonth.mockResolvedValue(topIds);
    songRepo.getSongsByIds.mockResolvedValue(rawSongs);

    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(42);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "popdesc" });

    const result = await songService.getMostPopular(2023, 5, 10);

    expect(visualizationRepo.getTopSongIdsByMonth).toHaveBeenCalledWith(
      2023,
      5,
      10
    );
    expect(songRepo.getSongsByIds).toHaveBeenCalledWith(topIds);

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      idSong: 3,
      userName: "User3",
      description: "popdesc",
      visualizations: 42,
      pathImageUrl: null,
    });
    expect(result[1]).toMatchObject({
      idSong: 1,
      userName: "User1",
      description: "popdesc",
      visualizations: 42,
      pathImageUrl: null,
    });
    expect(result[2]).toMatchObject({
      idSong: 2,
      userName: "User2",
      description: "popdesc",
      visualizations: 42,
      pathImageUrl: null,
    });
  });

  test("should usar valores por defecto si se pasan valores inválidos", async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const topIds = [1];
    const rawSongs = [
      {
        idSong: 1,
        songName: "Solo",
        fileName: "solo.mp3",
        durationSeconds: 111,
        releaseDate: "2020-07-07",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        idAppUser_AppUser: { nameUser: "UserSolo" },
        toJSON() {
          return this;
        },
      },
    ];

    visualizationRepo.getTopSongIdsByMonth.mockResolvedValue(topIds);
    songRepo.getSongsByIds.mockResolvedValue(rawSongs);

    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(7);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "defdesc" });

    const result = await songService.getMostPopular("bad", null, "500");

    expect(visualizationRepo.getTopSongIdsByMonth).toHaveBeenCalledWith(
      year,
      month,
      60
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      idSong: 1,
      userName: "UserSolo",
      description: "defdesc",
      visualizations: 7,
      pathImageUrl: null,
    });
  });
});

describe("song.service - getSong", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should throw error if songId is not a number", async () => {
    await expect(songService.getSong("abc")).rejects.toThrow(
      "Invalid song ID: 'abc' is not a number"
    );
  });

  test("should throw error if song is not found", async () => {
    songRepo.getSongById.mockResolvedValue(null);
    await expect(songService.getSong(999)).rejects.toThrow(
      "Song with id 999 not found"
    );
  });

  test("should return formatted song when song is found with all data", async () => {
    const mockSong = {
      idSong: 1,
      songName: "Song 1",
      fileName: "s1.mp3",
      durationSeconds: 120,
      releaseDate: "2022-01-01",
      isDeleted: false,
      idSongGenre: 1,
      idSongExtension: 1,
      idAppUser_AppUser: { nameUser: "User1" },
      toJSON() {
        return this;
      },
    };

    songRepo.getSongById.mockResolvedValue(mockSong);
    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(15);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "desc1" });

    const result = await songService.getSong(1);

    expect(result).toMatchObject({
      idSong: 1,
      songName: "Song 1",
      userName: "User1",
      visualizations: 15,
      description: "desc1",
      pathImageUrl: null,
    });
  });

  test("should fetch extra details when idAppUser_AppUser is missing", async () => {
    const baseSong = {
      idSong: 2,
      idAppUser_AppUser: undefined,
    };
    const detailedSong = {
      idSong: 2,
      songName: "Song 2",
      fileName: "s2.mp3",
      durationSeconds: 200,
      releaseDate: "2022-02-02",
      isDeleted: false,
      idSongGenre: 2,
      idSongExtension: 2,
      idAppUser_AppUser: { nameUser: "User2" },
      toJSON() {
        return this;
      },
    };

    songRepo.getSongById.mockResolvedValue(baseSong);
    songRepo.getByIdWithDetails.mockResolvedValue(detailedSong);
    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(20);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "desc2" });

    const result = await songService.getSong(2);

    expect(songRepo.getByIdWithDetails).toHaveBeenCalledWith(2);
    expect(result).toMatchObject({
      idSong: 2,
      userName: "User2",
      visualizations: 20,
      description: "desc2",
    });
  });
});

describe("song.service - getSongOfUser", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should return formatted song list for a given userId", async () => {
    const rawSongs = [
      {
        idSong: 1,
        songName: "UserSong",
        fileName: "us1.mp3",
        durationSeconds: 180,
        releaseDate: "2023-01-01",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        idAppUser_AppUser: { nameUser: "UserX" },
        toJSON() {
          return this;
        },
      },
    ];

    songRepo.getSongsByUserId.mockResolvedValue(rawSongs);
    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(9);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "userdesc" });

    const result = await songService.getSongOfUser(7);

    expect(songRepo.getSongsByUserId).toHaveBeenCalledWith(7);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      idSong: 1,
      userName: "UserX",
      description: "userdesc",
      visualizations: 9,
      pathImageUrl: null,
    });
  });

  test("should throw if repository throws error", async () => {
    songRepo.getSongsByUserId.mockRejectedValue(
      new Error("Failed to fetch songs")
    );

    await expect(songService.getSongOfUser(3)).rejects.toThrow(
      "Failed to fetch songs"
    );
  });
});

describe("song.service - getLastUserSong", () => {
  afterEach(() => jest.restoreAllMocks());

  test("should return null if user has no recent song", async () => {
    songRepo.getMostRecentSongByUser.mockResolvedValue(null);

    const result = await songService.getLastUserSong(42);
    expect(songRepo.getMostRecentSongByUser).toHaveBeenCalledWith(42);
    expect(result).toBeNull();
  });

  test("should return formatted song if recent song exists", async () => {
    const rawSong = {
      idSong: 10,
      songName: "LastSong",
      fileName: "last.mp3",
      durationSeconds: 240,
      releaseDate: "2024-01-01",
      isDeleted: false,
      idSongGenre: 1,
      idSongExtension: 1,
      idAppUser_AppUser: { nameUser: "UserLast" },
      toJSON() {
        return this;
      },
    };

    songRepo.getMostRecentSongByUser.mockResolvedValue(rawSong);
    songPhotoRepo.getBySongPhotoId.mockResolvedValue(null);
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(99);
    jest
      .spyOn(SongDescriptionRepository.prototype, "getBySongId")
      .mockResolvedValue({ description: "latestdesc" });

    const result = await songService.getLastUserSong(77);

    expect(songRepo.getMostRecentSongByUser).toHaveBeenCalledWith(77);
    expect(result).toMatchObject({
      idSong: 10,
      userName: "UserLast",
      description: "latestdesc",
      visualizations: 99,
      pathImageUrl: null,
    });
  });
});
