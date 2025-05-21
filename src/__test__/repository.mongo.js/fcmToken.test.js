const mongoose = require('mongoose');
const FcmToken = require('../../modelsMongo/fcmTokens');
const repository = require('../../repositories/fcmToken.mongo.repository');

jest.mock('../../modelsMongo/fcmTokens');

describe('fcmTokenRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createToken', () => {
    it('should save a new token', async () => {
      const mockData = { user_id: 1, token: 'abc' };
      const mockSave = jest.fn().mockResolvedValue(mockData);
      FcmToken.mockImplementation(() => ({ save: mockSave }));

      const result = await repository.createToken(mockData);

      expect(FcmToken).toHaveBeenCalledWith(mockData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('existsByUserId', () => {
    it('should return true if token exists', async () => {
      FcmToken.exists.mockResolvedValue(true);

      const result = await repository.existsByUserId(1);

      expect(FcmToken.exists).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toBe(true);
    });
  });

  describe('updateTokenByUserId', () => {
    it('should update the token and return the new document', async () => {
      const mockUpdated = { token: 'new-token' };
      FcmToken.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const result = await repository.updateTokenByUserId(1, { token: 'new-token' });

      expect(FcmToken.findOneAndUpdate).toHaveBeenCalledWith(
        { user_id: 1 },
        expect.objectContaining({ token: 'new-token' }),
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('getTokenByUserId', () => {
    it('should return the token document', async () => {
      const mockToken = { user_id: 1, token: 'abc' };
      FcmToken.findOne.mockResolvedValue(mockToken);

      const result = await repository.getTokenByUserId(1);

      expect(FcmToken.findOne).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual(mockToken);
    });
  });
});
