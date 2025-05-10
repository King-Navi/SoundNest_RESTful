const { Notification } = require('../modelsMongo/notification');

class NotificationRepository {
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
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) {
        throw new Error('Notification not found');
    }
    return notification;
  }

  async findByUserId(userId) {
    return await Notification.find({ user_id: userId });
  }
}

module.exports = NotificationRepository;
