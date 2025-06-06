const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authorization = require("../middlewares/auth.middleware");
const {
  canAccessNotificationsByIdUser,
  canAccessNotificationsByIdNotification,
  canDeleteByIdNotification,
  canMarkReadNotification,
} = require("../middlewares/canAccess.middleware");

router.post(
  /*
#swagger.path = '/api/notifications/createNotification'
#swagger.tags = ['Notifications']
#swagger.summary = 'Crear una notificación'
#swagger.parameters['body'] = {
    in: 'body',
    description: 'Cuerpo de la solicitud',
    required: true,
    schema: {
        type: 'object',
        properties: {
            title: {type: 'string', example: 'Title'},
            sender: { type: 'string', example: 'admin' },
            user_id: { type: 'integer', example: 101 },
            user: { type: 'string', example: 'john' },
            notification: { type: 'string', example: 'Tienes un nuevo mensaje en tu bandeja de entrada.' },
            relevance: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' }
        },
        required: ['title','sender', 'user_id', 'user', 'notification', 'relevance']
    }
}
#swagger.responses[204] = GOOD, no content
#swagger.responses[400] = { description: 'Error en la solicitud' }
*/
  "/createNotification",
  notificationController.createNotification
);

router.get(
  /*
#swagger.path = '/api/notifications/:id/notification'
#swagger.tags = ['Notifications']
#swagger.summary = 'Obtener notificación por ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID de la notificación (ej: 6814750fc209c9e3eb9bcd5b)',
    required: true
}
#swagger.responses[200] = {
    description: 'Detalle de la notificación',
    schema: {
        "_id": "6821618d4f26dc92ccb426ff",
        "title": "asdasd",
        "sender": "fulanito23232",
        "user_id": 1,
        "user": "u",
        "notification": "high",
        "relevance": "high",
        "read": false,
        "createdAt": "2025-05-12T02:48:45.459Z",
        "__v": 0
    }
}
#swagger.responses[404] = { description: 'Notificación no encontrada' }
*/
  "/:id/notification",
  authorization,
  canAccessNotificationsByIdNotification,
  notificationController.getNotificationById
);

router.get(
  /*
#swagger.path = '/api/notifications/getNotifications/:userId'
#swagger.tags = ['Notifications']
#swagger.summary = 'Obtener todas las notificaciones de un usuario'
#swagger.parameters['userId'] = {
    in: 'path',
    description: 'ID del usuario (ej: 101)',
    required: true
}
#swagger.responses[200] = {
    description: 'Lista de notificaciones del usuario',
    schema: [{
        "_id": "6821618d4f26dc92ccb426ff",
        "title": "asdasd",
        "sender": "fulanito23232",
        "user_id": 1,
        "user": "u",
        "notification": "high",
        "relevance": "high",
        "read": false,
        "createdAt": "2025-05-12T02:48:45.459Z",
        "__v": 0
    }]
}
#swagger.responses[400] = { description: 'Error en la solicitud' }
*/
  "/getNotifications/:userId",
  authorization,
  canAccessNotificationsByIdUser,
  notificationController.getAllNotificationsForUser
);

router.delete(
  /*
#swagger.path = '/api/notifications/delete/:id'
#swagger.tags = ['Notifications']
#swagger.summary = 'Eliminar notificación por ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID de la notificación (ej: 681471c0914598e2e39a7adb)',
    required: true
}
#swagger.responses[204] = { description: 'Notificación eliminada' }
#swagger.responses[404] = { description: 'Notificación no encontrada' }
*/
  "/delete/:id",
  authorization,
  canDeleteByIdNotification,
  notificationController.deleteNotificationById
);

router.patch(
  /*
#swagger.path = '/api/notifications/notification/:id/read'
#swagger.tags = ['Notifications']
#swagger.summary = 'Marcar notificación como leída'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID de la notificación (ej: 6814750fc209c9e3eb9bcd5b)',
    required: true
}
#swagger.responses[204] = { description: 'Notificación marcada como leída' }
#swagger.responses[400] = { description: 'Formato de ID inválido' }
#swagger.responses[404] = { description: 'Notificación no encontrada' }
*/
  "/notification/:id/read",
  authorization,
  canMarkReadNotification,
  notificationController.markNotificationAsRead
);

module.exports = router;
