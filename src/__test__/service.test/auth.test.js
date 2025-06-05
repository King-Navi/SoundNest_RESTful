const fcmTokenRepository = require('../../repositories/fcmToken.mongo.repository');
const { UpdateFcmTokenService } = require('../../service/auth.service');

jest.mock('../../repositories/fcmToken.mongo.repository');

describe('UpdateFcmTokenService', () => {
  const user_id = 'user123';
  const input = {
    user_id,
    token: 'new-token-123',
    device: 'android',
    platform_version: '13',
    app_version: '1.2.3',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new token if none exists', async () => {
    fcmTokenRepository.getTokenByUserId.mockResolvedValue(null);

    const createdToken = { ...input, _id: 'new-token-id' };
    fcmTokenRepository.createToken.mockResolvedValue(createdToken);

    const result = await UpdateFcmTokenService(input);

    expect(fcmTokenRepository.getTokenByUserId).toHaveBeenCalledWith(user_id);
    expect(fcmTokenRepository.createToken).toHaveBeenCalledWith(input);
    expect(result).toBe(createdToken);
  });
});
