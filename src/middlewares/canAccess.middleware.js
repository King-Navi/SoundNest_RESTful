const { getPlaylistById } = require("../service/playlist.service");
const NotificationRepository = require("../repositories/notification.mongo.repository");
/**
 * Middleware to authorize access to a playlist resource.
 *
 * The middleware retrieves the playlist using the ID from `req.params.id` and checks if
 * the authenticated user (from `req.user`) is either the playlist owner or has an admin role.
 *
 * If the playlist does not exist → 404 Not Found  
 * If the user is not authorized   → 403 Forbidden  
 * If authorized, the playlist object is attached to `req.playlist` and the request proceeds.
 */
const canAccessPlaylist = (req, res, next) => {
  return async (req, res, next) => {
    const playlistId = req.params.id;
    try {
      const playlist = await getPlaylistById(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      const userId = req.user.id;
      const isOwner = playlist.ownerId === userId;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.playlist = playlist;

      next();
    } catch (err) {
      console.error("[canAccessPlaylist]", err.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

/**
 * Middleware to authorize access to a specific notification by ID.
 *
 * The middleware retrieves a notification from the database by `req.params.id` and verifies
 * if the authenticated user is the owner (`notification.user_id`) or has an admin role.
 *
 * If the notification does not exist → 404 Not Found  
 * If the user is not authorized       → 403 Forbidden  
 * On success, attaches the notification to `req.notification` and calls next().
 */

const canAccessNotificationsByIdNotification = async (req, res, next) => {
  try {
    const notificationRepository = new NotificationRepository();
    const notificationId = req.params.id;

    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const userId = req.user?.id;
    const isOwner = notification.user_id == userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.notification = notification;
    next();
  } catch (err) {
    console.error("[canAccessNotificationsByIdUser] Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Middleware to ensure the authenticated user can access notifications belonging to a specific user ID.
 *
 * Compares `req.params.userId` (target user) with `req.user.id` (authenticated user).
 * Access is allowed only if both match.
 *
 * If user is not authenticated       → 401 Unauthorized  
 * If user IDs do not match           → 403 Forbidden  
 * On success, the request proceeds.
 */

const canAccessNotificationsByIdUser = async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId;
    const authenticatedUserId = req.user?.id;

    if (!authenticatedUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: no user info in token" });
    }

    if (requestedUserId != authenticatedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (err) {
    console.error("[canAccessNotificationsByIdUser] Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Middleware to authorize deletion of a notification by ID.
 *
 * Fetches the notification using `req.params.id` and verifies whether the user
 * is either the owner (`notification.user_id`) or has an admin role.
 *
 * If the notification does not exist → 404 Not Found  
 * If the user is not authorized       → 403 Forbidden  
 * On success, attaches the notification to `req.notification` and calls next().
 */

const canDeleteByIdNotification = async (req, res, next) => {
  try {
    const notificationRepository = new NotificationRepository();
    const notificationId = req.params.id;

    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const userId = req.user?.id;
    const isOwner = notification.user_id == userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.notification = notification;
    next();
  } catch (err) {
    console.error("[canAccessNotificationsByIdUser] Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Middleware to authorize marking a notification as read.
 *
 * Retrieves the notification by `req.params.id` and checks if the
 * authenticated user is the owner of the notification (`notification.user_id`).
 *
 * Only the owner can mark the notification as read.
 * If not found → 404 Not Found  
 * If not owner → 403 Forbidden  
 * On success, attaches the notification to `req.notification` and proceeds.
 */

const canMarkReadNotification = async (req, res, next) => {
  try {
    const notificationRepository = new NotificationRepository();
    const notificationId = req.params.id;

    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const userId = req.user?.id;
    const isOwner = notification.user_id == userId;

    if (!isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.notification = notification;
    next();
  } catch (err) {
    console.error("[canAccessNotificationsByIdUser] Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  canAccessPlaylist,
  canAccessNotificationsByIdNotification,
  canAccessNotificationsByIdUser,
  canDeleteByIdNotification,
  canMarkReadNotification,
};
