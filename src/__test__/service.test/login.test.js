const { loginService } = require('../../service/login.service');
const userRepository = require('../../repositories/user.repository');
const { comparePasswords } = require('../../utils/hash.util');
const { generateToken } = require('../../service/jwt.service');
const { ValidationError } = require('../../utils/exceptions/validation.exception');

jest.mock('../../repositories/user.repository');
jest.mock('../../utils/hash.util');
jest.mock('../../service/jwt.service');

describe('loginService', () => {
  const username = 'testuser';
  const password = 'secret';

  const fakeUser = {
    idUser: 1,
    nameUser: username,
    email: 'test@example.com',
    password: 'hashedPassword',
    idRole: 2,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should throw ValidationError if user not found', async () => {
    userRepository.findUserByName.mockResolvedValue(null);

    await expect(loginService({ username, password }))
      .rejects.toThrow(new ValidationError('User not found'));

    expect(userRepository.findUserByName).toHaveBeenCalledWith(username);
  });

  test('should throw ValidationError if password is invalid', async () => {
    userRepository.findUserByName.mockResolvedValue(fakeUser);
    comparePasswords.mockResolvedValue(false);

    await expect(loginService({ username, password }))
      .rejects.toThrow(new ValidationError('Invalid credentials'));

    expect(comparePasswords).toHaveBeenCalledWith(password, fakeUser.password);
  });

  test('should return a token if credentials are valid', async () => {
    userRepository.findUserByName.mockResolvedValue(fakeUser);
    comparePasswords.mockResolvedValue(true);
    generateToken.mockReturnValue('valid.jwt.token');

    const result = await loginService({ username, password });

    expect(generateToken).toHaveBeenCalledWith(fakeUser);
    expect(result).toEqual({ token: 'valid.jwt.token' });
  });
});
