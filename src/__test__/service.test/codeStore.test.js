const {
  setCode,
  getCode,
  deleteCode,
  hasCode,
} = require('../../service/codeStore.service');

describe('codeStore.service', () => {
  const email = 'User@Example.Com';
  const normalized = email.trim().toLowerCase();
  const code = 'ABC123';

  afterEach(() => {
    deleteCode(email);
  });

  test('setCode should store the code normalized by email', () => {
    setCode(email, code);
    const stored = getCode(email);
    expect(stored).toEqual({ code });
  });

  test('getCode should retrieve the code using a case-insensitive email', () => {
    setCode(email, code);
    const result = getCode('user@example.com');
    expect(result).toEqual({ code });
  });

  test('deleteCode should remove the code entry for the email', () => {
    setCode(email, code);
    deleteCode(email);
    const result = getCode(email);
    expect(result).toBeUndefined();
  });

  test('hasCode should return true if a code exists in the store', () => {
    setCode(email, code);
    expect(hasCode(code)).toBe(true);
  });

  test('hasCode should return false if the code does not exist', () => {
    expect(hasCode('nonexistent')).toBe(false);
  });
});
