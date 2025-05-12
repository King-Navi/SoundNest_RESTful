const { getPlaylistById } = require('../service/playlist.service');
const NotificationRepository = require('../repositories/notification.mongo.repository')
const canAccessPlaylist = (req, res, next) => {
  return async (req, res, next) => {
    const playlistId = req.params.id; //TODO PEDIR PARAMETRO
    //TODO:REVISAR
    try {
      const playlist = await getPlaylistById(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }

      const userId = req.user.id;
      const isOwner = playlist.ownerId === userId;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Puedes adjuntar la playlist si quieres evitar volverla a buscar
      req.playlist = playlist;

      next();
    } catch (err) {
      console.error('[canAccessPlaylist]', err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

const canAccessNotificationsByIdNotification = async (req, res, next) => {
    try {
      const notificationRepository = new NotificationRepository();
      const notificationId = req.params.id;

      const notification = await notificationRepository.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      const userId = req.user?.id;
      const isOwner = notification.user_id == userId;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.notification = notification;
      next();
    } catch (err) {
      console.error('[canAccessNotificationsByIdUser] Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const canAccessNotificationsByIdUser = async (req, res, next) => {
    try {
      const requestedUserId = req.params.userId;
      const authenticatedUserId = req.user?.id;

      if (!authenticatedUserId) {
        return res.status(401).json({ message: 'Unauthorized: no user info in token' });
      }

      if (requestedUserId != authenticatedUserId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error('[canAccessNotificationsByIdUser] Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const canDeleteByIdNotification = async (req, res, next) => {
    try {
      const notificationRepository = new NotificationRepository();
      const notificationId = req.params.id;

      const notification = await notificationRepository.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      const userId = req.user?.id;
      const isOwner = notification.user_id == userId;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.notification = notification;
      next();
    } catch (err) {
      console.error('[canAccessNotificationsByIdUser] Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const canMarkReadNotification = async (req, res, next) => {
    try {
      const notificationRepository = new NotificationRepository();
      const notificationId = req.params.id;

      const notification = await notificationRepository.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      const userId = req.user?.id;
      const isOwner = notification.user_id == userId;

      if (!isOwner) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.notification = notification;
      next();
    } catch (err) {
      console.error('[canAccessNotificationsByIdUser] Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { 
  canAccessPlaylist,
  canAccessNotificationsByIdNotification,
  canAccessNotificationsByIdUser,
  canDeleteByIdNotification,
  canMarkReadNotification,
};
