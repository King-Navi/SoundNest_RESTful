jest.mock('../../models/init-models');
jest.mock('../../config/sequelize', () => 'fake-sequelize');

const initModels = require('../../models/init-models');
const { Sequelize } = require('sequelize');
const { ConnectionError, DatabaseError, UniqueConstraintError } = Sequelize;

const mockFindOne = jest.fn();
const mockCreate = jest.fn();
initModels.mockReturnValue({ AppUser: { findOne: mockFindOne, create: mockCreate } });

const { findUserByEmail, findUserByName, createUser } = require('../../repositories/user.repository');

describe('findUserByEmail', () => {
  const emailInput = 'Test@Example.com';
  beforeEach(() => {
    mockFindOne.mockReset();
  });
  it('should return the found user (case-insensitive)', async () => {
    const fakeUser = { id: 42, email: 'test@example.com' };
    mockFindOne.mockResolvedValue(fakeUser);
    const result = await findUserByEmail(emailInput);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: expect.any(Object)
    });
    expect(result).toBe(fakeUser);
  });
  it('should throw "Cannot connect to the database." if ConnectionError occurs', async () => {
    mockFindOne.mockRejectedValue(new ConnectionError('connection failed'));
    await expect(findUserByEmail(emailInput)).rejects.toThrow('Cannot connect to the database.');
  });
  it('should throw "Database error occurred." if DatabaseError occurs', async () => {
    const inner = new Error('internal');
    mockFindOne.mockRejectedValue(new DatabaseError(inner));
    await expect(findUserByEmail(emailInput)).rejects.toThrow('Database error occurred.');
  });
  it('should propagate other errors without modification', async () => {
    const custom = new Error('other');
    mockFindOne.mockRejectedValue(custom);
    await expect(findUserByEmail(emailInput)).rejects.toBe(custom);
  });
});

describe('findUserByName', () => {
  const nameInput = 'TestUser';
  beforeEach(() => {
    mockFindOne.mockReset();
  });
  it('should return the found user (case-insensitive)', async () => {
    const fakeUser = { id: 7, nameUser: 'testuser' };
    mockFindOne.mockResolvedValue(fakeUser);
    const result = await findUserByName(nameInput);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: expect.any(Object)
    });
    expect(result).toBe(fakeUser);
  });
  it('should throw "Cannot connect to the database." if ConnectionError occurs', async () => {
    mockFindOne.mockRejectedValue(new ConnectionError('connection failed'));
    await expect(findUserByName(nameInput)).rejects.toThrow('Cannot connect to the database.');
  });
  it('should throw "Database error occurred." if DatabaseError occurs', async () => {
    const inner = new Error('internal');
    mockFindOne.mockRejectedValue(new DatabaseError(inner));
    await expect(findUserByName(nameInput)).rejects.toThrow('Database error occurred.');
  });
  it('should propagate other errors without modification', async () => {
    const custom = new Error('other');
    mockFindOne.mockRejectedValue(custom);
    await expect(findUserByName(nameInput)).rejects.toBe(custom);
  });
});

describe('createUser', () => {
  const userData = { email: 'test@example.com', nameUser: 'TestUser' };
  beforeEach(() => {
    mockCreate.mockReset();
  });
  it('should create and return the new user', async () => {
    const fakeUser = { id: 100, ...userData };
    mockCreate.mockResolvedValue(fakeUser);
    const result = await createUser(userData);
    expect(mockCreate).toHaveBeenCalledWith(userData);
    expect(result).toBe(fakeUser);
  });
  it('should throw "A user with that email already exists." if UniqueConstraintError occurs', async () => {
    mockCreate.mockRejectedValue(new UniqueConstraintError({ errors: [], message: 'duplicate' }));
    await expect(createUser(userData)).rejects.toThrow('A user with that email already exists.');
  });
  it('should throw "Could not connect to the database." if ConnectionError occurs', async () => {
    mockCreate.mockRejectedValue(new ConnectionError('connection failed'));
    await expect(createUser(userData)).rejects.toThrow('Could not connect to the database.');
  });
  it('should propagate other errors without modification', async () => {
    const custom = new Error('other');
    mockCreate.mockRejectedValue(custom);
    await expect(createUser(userData)).rejects.toBe(custom);
  });
});
