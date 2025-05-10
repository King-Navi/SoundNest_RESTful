const { generateToken, verifyJwtToken } = require('../service/jwtService');

describe('JWT Service', () => {
  const mockUser = {
    id: '123',
    username: 'testuser',
    privateEmail: 'test@example.com',
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'supersecretkey';
  });

  test('generateToken should return a valid JWT token', () => {
    const token = generateToken(mockUser);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWTs have 3 parts
  });

  test('verifyJwtToken should return the payload for a valid token', () => {
    const token = generateToken(mockUser);
    const payload = verifyJwtToken(token);

    expect(payload).toMatchObject({
      id: mockUser.id,
      username: mockUser.username,
      privateEmail: mockUser.privateEmail,
    });
  });

  test('verifyJwtToken should return null for invalid token', () => {
    const invalidToken = 'invalid.token.string';
    const result = verifyJwtToken(invalidToken);
    expect(result).toBeNull();
  });
});
