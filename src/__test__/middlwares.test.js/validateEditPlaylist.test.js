const {validateEditPlaylist} = require('../../middlewares/validateEditPlaylist.middleware');

describe('validateEditPlaylist middleware', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call next if playlist_name is provided', () => {
    const req = { body: { playlist_name: 'My Playlist' } };
    const res = mockResponse();

    validateEditPlaylist(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should call next if description is provided', () => {
    const req = { body: { description: 'Just vibes' } };
    const res = mockResponse();

    validateEditPlaylist(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should call next if both fields are provided', () => {
    const req = { body: { playlist_name: 'Chill', description: 'Smooth songs' } };
    const res = mockResponse();

    validateEditPlaylist(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should return 400 if neither field is provided', () => {
    const req = { body: {} };
    const res = mockResponse();

    validateEditPlaylist(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Invalid input',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 if playlist_name is too long', () => {
    const req = { body: { playlist_name: 'a'.repeat(101) } };
    const res = mockResponse();

    validateEditPlaylist(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Invalid input',
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 if description is too long', () => {
    const req = { body: { description: 'a'.repeat(501) } };
    const res = mockResponse();

    validateEditPlaylist(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Invalid input',
    }));
    expect(next).not.toHaveBeenCalled();
  });
});
