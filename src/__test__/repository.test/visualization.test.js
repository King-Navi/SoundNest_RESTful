const { literal } = require("sequelize");

const mockQuery = jest.fn();
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockFindByPk = jest.fn();
const mockUpdate = jest.fn();

jest.mock("../../config/sequelize", () => ({
  query: mockQuery,
  literal: require("sequelize").literal,
  QueryTypes: { SELECT: "SELECT" },
}));

jest.mock("../../models/init-models", () => {
  return jest.fn(() => ({
    Visualization: {
      create: mockCreate,
      findAll: mockFindAll,
      findOne: mockFindOne,
      findByPk: mockFindByPk,
      update: mockUpdate,
    },
  }));
});

let visualizationRepo;

beforeEach(() => {
  jest.clearAllMocks();
  visualizationRepo = require("../../repositories/visualization.repository");
});

describe("Visualization Repository (mocked)", () => {
  test("create() should call Visualization.create", async () => {
    mockCreate.mockResolvedValue({ idVisualizations: 1, playCount: 5 });
    const result = await visualizationRepo.create(5, "2025-05-01", 1);
    expect(mockCreate).toHaveBeenCalledWith({ playCount: 5, period: "2025-05-01", idSong: 1 });
    expect(result.idVisualizations).toBe(1);
  });

  test("existsByIdAndPeriodMonthYear() should return true", async () => {
    mockQuery.mockResolvedValue([{ "1": 1 }]);
    const exists = await visualizationRepo.existsByIdAndPeriodMonthYear(1, 5, 2025);
    expect(exists).toBe(true);
  });

  test("existsByIdAndPeriodMonthYear() should return false", async () => {
    mockQuery.mockResolvedValue([]);
    const exists = await visualizationRepo.existsByIdAndPeriodMonthYear(1, 5, 2025);
    expect(exists).toBe(false);
  });

  test("getBySongAndPeriodMonthYear() should return a result", async () => {
    mockFindOne.mockResolvedValue({ idVisualizations: 3 });
    const result = await visualizationRepo.getBySongAndPeriodMonthYear(1, 5, 2025);
    expect(result.idVisualizations).toBe(3);
  });

  test("incrementPlayCountById() should return true if updated", async () => {
    mockUpdate.mockResolvedValue([1]);
    const result = await visualizationRepo.incrementPlayCountById(5);
    expect(result).toBe(true);
  });

  test("getVisualizationsBySongId() should return sorted list", async () => {
    const vis = [
      { idVisualizations: 1, period: "2025-05-01" },
      { idVisualizations: 2, period: "2025-06-01" },
    ];
    mockFindAll.mockResolvedValue(vis);
    const result = await visualizationRepo.getVisualizationsBySongId(1);
    expect(result.length).toBe(2);
    expect(result[0].period < result[1].period).toBe(true);
  });

  test("getTopSongIdsByMonth() should return ordered song IDs", async () => {
    mockFindAll.mockResolvedValue([
      { idSong: 5, totalPlays: 120 },
      { idSong: 7, totalPlays: 110 },
    ]);
    const result = await visualizationRepo.getTopSongIdsByMonth(2025, 6, 10);
    expect(result).toEqual([5, 7]);
  });
});