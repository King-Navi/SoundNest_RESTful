const { searchQuerySchema, validateSearchQuery } = require('../../middlewares/validateSongSearch.middleware');

describe('searchQuerySchema (Joi)', () => {
  const opts = { abortEarly: false, allowUnknown: true, stripUnknown: true };

  test('pasa con sólo songName y aplica defaults', () => {
    const { error, value } = searchQuerySchema.validate({ songName: 'Hello' }, opts);
    expect(error).toBeUndefined();
    expect(value).toEqual({
      songName: 'Hello',
      limit: 10,
      offset: 0
    });
  });

  test('pasa con sólo artistName y valores por defecto', () => {
    const { error, value } = searchQuerySchema.validate({ artistName: 'Adele' }, opts);
    expect(error).toBeUndefined();
    expect(value.artistName).toBe('Adele');
    expect(value.limit).toBe(10);
    expect(value.offset).toBe(0);
  });

  test('pasa con sólo idGenre y convierte a número', () => {
    const { error, value } = searchQuerySchema.validate({ idGenre: '5' }, opts);
    expect(error).toBeUndefined();
    expect(value.idGenre).toBe(5);
    expect(value.limit).toBe(10);
    expect(value.offset).toBe(0);
  });

  test('falla si no hay songName, artistName ni idGenre', () => {
    const { error } = searchQuerySchema.validate({}, opts);
    expect(error).toBeDefined();
    // Debe incluir tu mensaje personalizado:
    expect(error.details.map(d => d.message).join()).toMatch(
      /Debes enviar al menos uno de estos parámetros/
    );
  });

  test('falla si limit < 1 o > 60', () => {
    const { error: e1 } = searchQuerySchema.validate({ songName: 'x', limit: 0 }, opts);
    expect(e1).toBeDefined();
    const { error: e2 } = searchQuerySchema.validate({ songName: 'x', limit: 100 }, opts);
    expect(e2).toBeDefined();
  });

  test('falla si offset < 0', () => {
    const { error } = searchQuerySchema.validate({ artistName: 'y', offset: -1 }, opts);
    expect(error).toBeDefined();
  });
});

describe('validateSearchQuery middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json:   jest.fn()
    };
    next = jest.fn();
  });

  test('invoca next() y normaliza query cuando es válido', () => {
    req.query = { songName: 'Hi', offset: '5' };
    validateSearchQuery(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.query).toEqual({
      songName: 'Hi',
      limit: 10,
      offset: 5
    });
  });

  test('devuelve 400 si faltan los filtros obligatorios', () => {
    req.query = { limit: '20' };
    validateSearchQuery(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringMatching(/Debes enviar al menos uno/)
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('devuelve 400 si algún parámetro es de tipo incorrecto', () => {
    req.query = { songName: 'A', limit: 'foo' };
    validateSearchQuery(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringMatching(/limit debe ser un número entero/)
    });
    expect(next).not.toHaveBeenCalled();
  });
});
