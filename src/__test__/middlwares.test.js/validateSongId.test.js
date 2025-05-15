const validateSongId = require('../../middlewares/validateSongId.middleware');
const SongRepository = require('../../repositories/song.repository');
jest.mock('../../repositories/song.repository');

const mockReq = (params) => ({ params });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const next = jest.fn();


describe('validateSongId middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe rechazar si el ID no es un número entero positivo', async () => {
    const req = mockReq({ idsong: 'abc' });
    const res = mockRes();

    await validateSongId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('debe responder 404 si la canción no existe', async () => {
    const req = mockReq({ idsong: '123' });
    const res = mockRes();

    SongRepository.getSongById.mockResolvedValue(null);

    await validateSongId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Canción no encontrada' });
    expect(next).not.toHaveBeenCalled();
  });

  test('debe llamar a next() si la canción existe', async () => {
    const req = mockReq({ idsong: '123' });
    const res = mockRes();
    const mockSong = { idSong: 123, songName: 'Test Song' };

    SongRepository.getSongById.mockResolvedValue(mockSong);

    await validateSongId(req, res, next);

    expect(req.song).toBe(mockSong);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('debe responder 500 si hay error en DB', async () => {
    const req = mockReq({ idsong: '123' });
    const res = mockRes();

    SongRepository.getSongById.mockRejectedValue(new Error('DB error')); 

    await validateSongId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringContaining('Error interno'),
    });
  });
});
