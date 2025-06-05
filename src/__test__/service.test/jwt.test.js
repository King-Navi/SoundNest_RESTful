const jwt = require("jsonwebtoken");
const { generateToken, verifyJwtToken } = require("../../service/jwt.service");

describe("JWT Service", () => {
  const mockUser = {
    idUser: 123,
    nameUser: "testuser",
    email: "test@example.com",
    idRole: 1,
  };

  beforeAll(() => {
    process.env.JWT_SECRET = "supersecretkey";
  });

  test("generateToken should return a valid JWT token", () => {
    const token = generateToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  test("verifyJwtToken should return the payload for a valid token", () => {
    const token = generateToken(mockUser);
    const payload = verifyJwtToken(token);

    expect(payload).toMatchObject({
      id: mockUser.idUser,
      username: mockUser.nameUser,
      email: mockUser.email,
      role: mockUser.idRole,
    });
  });

  test("verifyJwtToken should return null for invalid token", () => {
    const invalidToken = "invalid.token.string";
    const result = verifyJwtToken(invalidToken);
    expect(result).toBeNull();
  });

  test("verifyJwtToken should return null for tampered token", () => {
    const token = generateToken(mockUser);
    const tampered = token.slice(0, -1) + "x";

    const result = verifyJwtToken(tampered);
    expect(result).toBeNull();
  });

  test("verifyJwtToken should return null for expired token", (done) => {
    const shortLivedToken = jwt.sign(
      {
        id: 123,
        username: "expired",
        email: "expired@example.com",
        role: 1,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1ms" }
    );

    setTimeout(() => {
      const result = verifyJwtToken(shortLivedToken);
      expect(result).toBeNull();
      done();
    }, 10);
  });
});
