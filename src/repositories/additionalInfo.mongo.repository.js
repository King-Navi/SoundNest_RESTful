const AdditionalInfo = require("../modelsMongo/AdditionalInfo");

async function saveAdditionalInformation(userId, info) {
  try {
    return await AdditionalInfo.findOneAndUpdate(
      { userId },
      { $set: { info } },
      { upsert: true, new: true }
    );
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User additional info already exists' });
    }
    throw err;
  }
}

async function getAdditionalInformation(userId) {
  return await AdditionalInfo.findOne({ userId });
}

async function deleteAdditionalInformation(userId) {
  return await AdditionalInfo.deleteOne({ userId });
}

module.exports = {
  saveAdditionalInformation,
  getAdditionalInformation,
  deleteAdditionalInformation,
};
