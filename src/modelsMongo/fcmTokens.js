const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    ref: 'User',
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  device: {
    type: String,
    enum: ['android', 'ios', 'web'],
    default: 'android',
  },
  platform_version: {
    type: String,
  },
  app_version: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('FcmToken', fcmTokenSchema);
