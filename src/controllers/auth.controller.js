const { UpdateFcmTokenService } = require('../service/auth.service');

async function UpdateFCMTokenController(req, res) {
  try {
    const { token, device, platform_version, app_version } = req.body;
    const user_id = req.user?.id;

    if (!user_id || !token) {
      return res.status(400).json({ message: 'Missing user_id or token' });
    }

    await UpdateFcmTokenService({
      user_id,
      token,
      device,
      platform_version,
      app_version
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({message : "Failed to update"});
  }
}

module.exports = {
  UpdateFCMTokenController,
};