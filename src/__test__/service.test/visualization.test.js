jest.useFakeTimers("modern").setSystemTime(new Date(Date.UTC(2025, 4, 10, 12, 0, 0))); 
// Fijamos la fecha a: 10 de mayo de 2025 12:00 UTC.
// Después de restar 6 horas (America/Mexico_City), será 10 de mayo de 2025 06:00, 
// de modo que el "period" al formatearse con "yyyy-MM-01" será "2025-05-01".

jest.mock("../../repositories/visualization.repository");
const visualizationRepo = require("../../repositories/visualization.repository");

const {
  increasePlayCountForSong,
  getVisualizationBySongAndPeriod,
  getVisualizationsForSong,
  getTopSongsByPeriod,
} = require("../../service/visualization.service");
const { NonexistentVisualization } = require("../../service/exceptions/exceptions");

describe("increasePlayCountForSong", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lanza error si idSong es inválido", async () => {
    await expect(increasePlayCountForSong(null)).rejects.toThrow(
      "Invalid idSong in increasePlayCountForSong()"
    );
    await expect(increasePlayCountForSong("abc")).rejects.toThrow(
      "Invalid idSong in increasePlayCountForSong()"
    );
  });

  it("incrementa playCount cuando ya existe una visualización en el mes actual", async () => {
    const fakeExisting = { idVisualizations: 123, playCount: 5 };
    visualizationRepo.getBySongAndPeriodMonthYear.mockResolvedValue(fakeExisting);
    visualizationRepo.incrementPlayCountById.mockResolvedValue();

    await increasePlayCountForSong(42);

    expect(visualizationRepo.getBySongAndPeriodMonthYear).toHaveBeenCalledWith(
      42,
      5, 
      2025
    );
    expect(visualizationRepo.incrementPlayCountById).toHaveBeenCalledWith(123);
    expect(visualizationRepo.create).not.toHaveBeenCalled();
  });

  it("crea nueva visualización cuando no existe para el mes actual", async () => {
    visualizationRepo.getBySongAndPeriodMonthYear.mockResolvedValue(null);
    visualizationRepo.create.mockResolvedValue();

    await increasePlayCountForSong(99);

    expect(visualizationRepo.getBySongAndPeriodMonthYear).toHaveBeenCalledWith(
      99,
      5, 
      2025
    );
    expect(visualizationRepo.create).toHaveBeenCalledWith(
      1,
      "2025-05-01",
      99
    );
    expect(visualizationRepo.incrementPlayCountById).not.toHaveBeenCalled();
  });
});

describe("getVisualizationBySongAndPeriod", () => {
  beforeEach(() => jest.clearAllMocks());

  it("lanza NonexistentVisualization cuando no hay registro para esa canción/periodo", async () => {
    visualizationRepo.getBySongAndPeriodMonthYear.mockResolvedValue(null);

    await expect(getVisualizationBySongAndPeriod(7, 3, 2024)).rejects.toThrow(
      NonexistentVisualization
    );
    await expect(getVisualizationBySongAndPeriod(7, 3, 2024)).rejects.toThrow(
      "No visualization found for song 7 in 3/2024"
    );
    expect(
      visualizationRepo.getBySongAndPeriodMonthYear
    ).toHaveBeenCalledWith(7, 3, 2024);
  });

  it("retorna el objeto cuando existe", async () => {
    const fakeVis = { idVisualizations: 55, playCount: 10, period: "2024-03-01" };
    visualizationRepo.getBySongAndPeriodMonthYear.mockResolvedValue(fakeVis);

    const result = await getVisualizationBySongAndPeriod(7, 3, 2024);
    expect(result).toBe(fakeVis);
    expect(
      visualizationRepo.getBySongAndPeriodMonthYear
    ).toHaveBeenCalledWith(7, 3, 2024);
  });
});

describe("getVisualizationsForSong", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna arreglo vacío si el repo así lo devuelve", async () => {
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue([]);
    const result = await getVisualizationsForSong(123);
    expect(result).toEqual([]);
    expect(visualizationRepo.getVisualizationsBySongId).toHaveBeenCalledWith(
      123
    );
  });

  it("retorna el arreglo que el repo devuelva (no vacío)", async () => {
    const fakeArray = [
      { idVisualizations: 1, playCount: 2 },
      { idVisualizations: 2, playCount: 4 },
    ];
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue(fakeArray);

    const result = await getVisualizationsForSong(555);
    expect(result).toBe(fakeArray);
    expect(visualizationRepo.getVisualizationsBySongId).toHaveBeenCalledWith(
      555
    );
  });
});

describe("getTopSongsByPeriod", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retorna los IDs que el repo devuelva", async () => {
    const fakeIds = [10, 3, 7];
    visualizationRepo.getTopSongIdsByMonth.mockResolvedValue(fakeIds);

    const result = await getTopSongsByPeriod(2022, 12, 5);
    expect(result).toBe(fakeIds);
    expect(visualizationRepo.getTopSongIdsByMonth).toHaveBeenCalledWith(
      2022,
      12,
      5
    );
  });

  it("retorna arreglo vacío si el repo devuelve []", async () => {
    visualizationRepo.getTopSongIdsByMonth.mockResolvedValue([]);
    const result = await getTopSongsByPeriod(2021, 1, 3);
    expect(result).toEqual([]);
    expect(visualizationRepo.getTopSongIdsByMonth).toHaveBeenCalledWith(
      2021,
      1,
      3
    );
  });
});
