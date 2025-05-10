const notificationService = require('../service/notification.service');

async function createNotification(req, res) {
  try {
    await notificationService.createNotification(req.body);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getNotificationById(req, res) {
  try {
    const notification = await notificationService.getNotificationById(req.params.id);
    res.json(notification);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function getAllNotificationsForUser(req, res) {
  try {
    const notifications = await notificationService.getAllNotificationsForUser(req.params.userId);
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateNotificationById(req, res) {
  try {
    const updated = await notificationService.updateNotificationById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function deleteNotificationById(req, res) {
  try {
    await notificationService.deleteNotificationById(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function markNotificationAsRead(req, res) {
  try {
    await notificationService.markNotificationAsRead(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.message === 'Invalid ID format') {
      res.status(400).json({ error: err.message });
  } else if (err.message === 'Notification not found') {
      res.status(404).json({ error: err.message });
  } else {
      res.status(500).json({ error: 'Internal server error' });
  }
  }
}

module.exports = {
  createNotification,
  getNotificationById,
  getAllNotificationsForUser,
  updateNotificationById,
  deleteNotificationById,
  markNotificationAsRead,
};
