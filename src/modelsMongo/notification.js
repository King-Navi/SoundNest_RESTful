const mongoose = require("mongoose");
const NOTIFICATION_RELEVANCE = require("./constants/notificationRelevance");

const notificationSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  notification: {
    type: String,
    required: true,
  },
  relevance: {
    type: String,
    enum: Object.values(NOTIFICATION_RELEVANCE),
    default: NOTIFICATION_RELEVANCE.LOW,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
