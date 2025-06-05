process.env.EMAIL_ACCOUNT = 'fake@example.com';
process.env.EMAIL_PASSWORD = 'fakepassword';

jest.mock('../../config/emailConfig', () => ({
  sendMail: jest.fn().mockResolvedValue(true),
}));

const { verifyConfirmationCode } = require('../../service/codeEmail.service');
const codeStore = require('../../service/codeStore.service');
const ConfirmationReasons = require('../../utils/enums/confirmationReasons');

jest.mock('../../service/codeStore.service');

describe('verifyConfirmationCode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return valid true if code matches and delete it', () => {
    const email = 'test@example.com';
    const code = 'ABC123';

    codeStore.getCode.mockReturnValue({ code });
    codeStore.deleteCode.mockImplementation(() => {});

    const result = verifyConfirmationCode(email, code);

    expect(codeStore.getCode).toHaveBeenCalledWith(email);
    expect(codeStore.deleteCode).toHaveBeenCalledWith(email);
    expect(result).toEqual({
      valid: true,
      reason: ConfirmationReasons.SUCCESS,
    });
  });
});
