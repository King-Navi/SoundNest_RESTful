const NotificationRepository = require("../repositories/notification.mongo.repository");
const notificationRepo = new NotificationRepository();
const mongoose = require("mongoose");

/**
 * Creates a new notification by delegating to the NotificationRepository.
 *
 * @param {Object} data - Notification data to be created.
 * @param {string} data.title - Title of the notification.
 * @param {string} data.sender - Sender of the notification.
 * @param {number} data.user_id - ID of the user receiving the notification.
 * @param {string} data.user - Name or identifier of the recipient user.
 * @param {string} data.notification - Notification message content.
 * @param {string} [data.relevance] - Optional relevance level ("low", "medium", or "high").
 * @param {Date} [data.createdAt] - Optional creation date (defaults to current time).
 * @param {boolean} [data.read] - Optional read status (defaults to `false`).
 *
 * @returns {Promise<Object>} The created notification document.
 *
 * @example
 * const notification = await createNotification({
 *   title: "Reminder",
 *   sender: "System",
 *   user_id: 42,
 *   user: "Alice",
 *   notification: "Your subscription is about to expire.",
 *   relevance: "medium"
 * });
 */
async function createNotification(data) {
  return await notificationRepo.create(data);
}

async function getNotificationById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
  const notification = await notificationRepo.findById(id);
  if (!notification) {
    throw new Error("Notification not found");
  }
  return notification;
}

async function getAllNotificationsForUser(userId) {
  return await notificationRepo.findAll(userId);
}

async function updateNotificationById(id, updateData) {
  const updated = await notificationRepo.updateById(id, updateData);
  if (!updated) {
    throw new Error("Notification not found or update failed");
  }
  return updated;
}

async function deleteNotificationById(id) {
  const deleted = await notificationRepo.deleteById(id);
  if (!deleted) {
    throw new Error("Notification not found or delete failed");
  }
  return deleted;
}

async function markNotificationAsRead(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
  return await notificationRepo.markAsRead(id);
}

module.exports = {
  createNotification,
  getNotificationById,
  getAllNotificationsForUser,
  updateNotificationById,
  deleteNotificationById,
  markNotificationAsRead,
};
