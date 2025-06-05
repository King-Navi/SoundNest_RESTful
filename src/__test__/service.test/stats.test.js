const {
  getUserSongStats,
  getTopSongsByUserService,
  getTopGlobalSongsService,
  getTopGlobalGenresService,
} = require("../../service/stats.service");

const {
  getTotalPlaysByUser,
  getMostPlayedSongByUser,
  getTopSongsByUser,
  getTopGlobalSongs,
  getTopGlobalGenres,
} = require("../../repositories/stats.repository");

jest.mock("../../repositories/stats.repository");

describe("stats.service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getUserSongStats", () => {
    test("debe retornar estadísticas cuando existen totalPlays y topSong", async () => {
      getTotalPlaysByUser.mockResolvedValue(123);
      getMostPlayedSongByUser.mockResolvedValue({
        songName: "Mi Canción Favorita",
        playCount: 45,
      });

      const result = await getUserSongStats(7);

      expect(getTotalPlaysByUser).toHaveBeenCalledWith(7);
      expect(getMostPlayedSongByUser).toHaveBeenCalledWith(7);

      expect(result).toEqual({
        totalPlays: 123,
        topSongName: "Mi Canción Favorita",
        playCount: 45,
      });
    });

    test("debe retornar estadísticas con topSongName = null y playCount = 0 si no hay topSong", async () => {
      getTotalPlaysByUser.mockResolvedValue(0);
      getMostPlayedSongByUser.mockResolvedValue(null);

      const result = await getUserSongStats(42);

      expect(getTotalPlaysByUser).toHaveBeenCalledWith(42);
      expect(getMostPlayedSongByUser).toHaveBeenCalledWith(42);

      expect(result).toEqual({
        totalPlays: 0,
        topSongName: null,
        playCount: 0,
      });
    });
  });

  describe("getTopSongsByUserService", () => {
    test("lanza error si falta userId", async () => {
      await expect(getTopSongsByUserService(null, 10)).rejects.toThrow(
        "User ID and limit are required"
      );
    });

    test("lanza error si falta limit", async () => {
      await expect(getTopSongsByUserService(5, 0)).rejects.toThrow(
        "User ID and limit are required"
      );
    });

    test("retorna lista de canciones cuando se proporcionan userId y limit", async () => {
      const mockList = [
        { songId: 1, songName: "A" },
        { songId: 2, songName: "B" },
      ];
      getTopSongsByUser.mockResolvedValue(mockList);

      const result = await getTopSongsByUserService(5, 3);

      expect(getTopSongsByUser).toHaveBeenCalledWith(5, 3);
      expect(result).toEqual(mockList);
    });
  });

  describe("getTopGlobalSongsService", () => {
    test("lanza error si falta limit", async () => {
      await expect(getTopGlobalSongsService(0)).rejects.toThrow(
        "Limit is required"
      );
    });

    test("retorna lista global cuando se proporciona limit", async () => {
      const mockGlobal = [
        { songId: 10, songName: "X" },
        { songId: 11, songName: "Y" },
      ];
      getTopGlobalSongs.mockResolvedValue(mockGlobal);

      const result = await getTopGlobalSongsService(5);

      expect(getTopGlobalSongs).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockGlobal);
    });
  });

  describe("getTopGlobalGenresService", () => {
    test("lanza error si falta limit", async () => {
      await expect(getTopGlobalGenresService()).rejects.toThrow(
        "Limit is required"
      );
    });

    test("retorna lista de géneros cuando se proporciona limit", async () => {
      const mockGenres = [
        { genreId: 1, genreName: "Rock" },
        { genreId: 2, genreName: "Pop" },
      ];
      getTopGlobalGenres.mockResolvedValue(mockGenres);

      const result = await getTopGlobalGenresService(2);

      expect(getTopGlobalGenres).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockGenres);
    });
  });
});
