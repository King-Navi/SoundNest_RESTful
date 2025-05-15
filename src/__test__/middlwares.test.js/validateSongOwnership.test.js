jest.mock('../../repositories/song.repository', () => ({
  ID_ROLE_AD: 2,
}));
const { ID_ROLE_AD } = require('../../repositories/song.repository');

const validateSongOwnership = require('../../middlewares/validateSongOwnership.middleware');

const mockReq = (song, user) => ({
  song,
  user,
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

describe('validateSongOwnership middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe rechazar si req.song no está definido', async () => {
    const req = mockReq(undefined, { id: 1, role: 2 });
    const res = mockRes();

    await validateSongOwnership(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Song not loaded in the request' });
    expect(next).not.toHaveBeenCalled();
  });

  test('debe permitir si el usuario es autor de la canción', async () => {
    const req = mockReq({ idAppUser: 10 }, { id: 10, role: 2 });
    const res = mockRes();

    await validateSongOwnership(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('debe permitir si el usuario es administrador', async () => {
    const req = mockReq({ idAppUser: 999 }, { id: 5, role: ID_ROLE_AD });
    const res = mockRes();

    await validateSongOwnership(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('debe rechazar si no es autor ni administrador', async () => {
  const req = mockReq({ idAppUser: 999 }, { id: 123, role: 99 });
  const res = mockRes();

  await validateSongOwnership(req, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ error: 'Acceso denegado' });
  expect(next).not.toHaveBeenCalled();
});
});
