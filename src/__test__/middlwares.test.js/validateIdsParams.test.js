const { validateParams } = require('../../middlewares/validateIdParams.middleware');
const Joi = require('joi');

const idParamSchema = Joi.object({
  idAppUser: Joi.number().integer().positive().required()
});

describe('validateParams middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('Debería llamar a next() si los parámetros son válidos', () => {
    req.params.idAppUser = 5;

    const middleware = validateParams(idParamSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debería responder con 400 si el parámetro es menor o igual a 0', () => {
    req.params.idAppUser = 0;

    const middleware = validateParams(idParamSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: '"idAppUser" must be a positive number'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería responder con 400 si el parámetro no es un número', () => {
    req.params.idAppUser = 'abc';

    const middleware = validateParams(idParamSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: '"idAppUser" must be a number'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debería responder con 400 si falta el parámetro', () => {
    const middleware = validateParams(idParamSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: '"idAppUser" is required'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
