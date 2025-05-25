const fcmTokenRepository = require("../repositories/fcmToken.mongo.repository");
/**
 * Create or update a user's FCM token.
 * Updates only if the token or device data changed.
 * @param {Object} params - Parameters for token registration.
 * @param {String|ObjectId} params.user_id - The ID of the user.
 * @param {String} params.token - FCM token string.
 * @param {String} [params.device] - Device type: 'android', 'ios', 'web'.
 * @param {String} [params.platform_version] - OS version.
 * @param {String} [params.app_version] - App version.
 */
async function UpdateFcmTokenService({
  user_id,
  token,
  device = "android",
  platform_version,
  app_version,
}) {
  const existingToken = await fcmTokenRepository.getTokenByUserId(user_id);

  if (existingToken) {
    const hasChanges =
      existingToken.token !== token ||
      existingToken.device !== device ||
      existingToken.platform_version !== platform_version ||
      existingToken.app_version !== app_version;

    if (hasChanges) {
      return await fcmTokenRepository.updateTokenByUserId(user_id, {
        token,
        device,
        platform_version,
        app_version,
      });
    }

    return existingToken;
  }

  return await fcmTokenRepository.createToken({
    user_id,
    token,
    device,
    platform_version,
    app_version,
  });
}

module.exports = {
  UpdateFcmTokenService,
};
