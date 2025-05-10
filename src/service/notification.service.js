const NotificationRepository = require('../repositories/notification.mongo.repository');
const notificationRepo = new NotificationRepository();
const mongoose = require('mongoose');


async function createNotification(data) {
  return await notificationRepo.create(data);
}

async function getNotificationById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const notification = await notificationRepo.findById(id);
  if (!notification) {
    throw new Error('Notification not found');
  }
  return notification;
}

async function getAllNotificationsForUser(userId) {
  return await notificationRepo.findAll(userId);
}

async function updateNotificationById(id, updateData) {
  const updated = await notificationRepo.updateById(id, updateData);
  if (!updated) {
    throw new Error('Notification not found or update failed');
  }
  return updated;
}

async function deleteNotificationById(id) {
  const deleted = await notificationRepo.deleteById(id);
  if (!deleted) {
    throw new Error('Notification not found or delete failed');
  }
  return deleted;
}

async function markNotificationAsRead(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
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
