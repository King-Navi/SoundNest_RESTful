const { Notification } = require("../modelsMongo/notification");

class NotificationRepository {
  /**
   * Creates a new notification in the database.
   *
   * @param {Object} notificationData - Object containing the notification data to be stored.
   * @param {string} notificationData.title - Title of the notification.
   * @param {string} notificationData.sender - Sender of the notification (e.g., a system or user).
   * @param {number} notificationData.user_id - ID of the user who will receive the notification.
   * @param {string} notificationData.user - Name or identifier of the recipient user.
   * @param {string} notificationData.notification - Content or message of the notification.
   * @param {string} [notificationData.relevance] - Relevance level of the notification (optional, defaults to "low").
   *                                                Must be one of the values defined in `NOTIFICATION_RELEVANCE`,
   *                                                such as "low", "medium", or "high".
   * @param {Date} [notificationData.createdAt] - Creation date of the notification (optional, defaults to current date).
   * @param {boolean} [notificationData.read] - Read status of the notification (optional, defaults to `false`).
   *
   * @returns {Promise<Object>} The created notification saved in the database.
   *
   * @example
   * const repo = new NotificationRepository();
   * const newNotification = await repo.create({
   *   title: 'New Message',
   *   sender: 'System',
   *   user_id: 123,
   *   user: 'John Doe',
   *   notification: 'You have a new message in your inbox.',
   *   relevance: 'HIGH'
   * });
   */
  async create(notificationData) {
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async findById(id) {
    return await Notification.findById(id);
  }

  async findAll(userId) {
    return await Notification.find({ user_id: userId });
  }

  async updateById(id, updateData) {
    return await Notification.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Notification.findByIdAndDelete(id);
  }

  async markAsRead(id) {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    return notification;
  }

  async findByUserId(userId) {
    return await Notification.find({ user_id: userId });
  }
}

module.exports = NotificationRepository;
