const express = require("express");
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { validateNewComment } = require("../middlewares/validateNewComment.middleware");

//TODO: autorization


router.post(
/*
#swagger.path = '/api/comment/comment'
#swagger.tags = ['Comments']
#swagger.summary = 'Crear un comentario'
#swagger.parameters['body'] = {
    in: 'body',
    description: 'Cuerpo del comentario',
    required: true,
    schema: {
        type: 'object',
        properties: {
            song_id: { type: 'integer', example: 123 },
            user: { type: 'string', example: 'any' },
            message: { type: 'string', example: 'any' }
        },
        required: ['song_id', 'user', 'message']
    }
}
#swagger.responses[204] = { description: 'Comentario creado exitosamente' }
#swagger.responses[500] = { description: 'Error del servidor' }
*/
    '/comment', validateNewComment , commentController.createComment);

router.get(
/*
    #swagger.path = '/api/comment/getComment/{song_id}/comments'
    #swagger.tags = ['Comments']
    #swagger.summary = 'Obtener comentarios por ID de canción'
    #swagger.parameters['song_id'] = {
        in: 'path',
        description: 'ID de la canción (ej: 1231231)',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Lista de comentarios',
        schema: [{
            _id: '681f473536ee5347ec38543c',
            song_id: 213,
            user: 'Pepe',
            message: 'Prueba',
            parent_id: null,
            timestamp: '2025-05-10T12:31:49.254Z',
            responses: [],
            __v: 0
        }]
    }
    #swagger.responses[404] = { description: 'No se encontraron comentarios' }
    #swagger.responses[500] = { description: 'Error del servidor' }
    */
    '/getComment/:song_id/comments', commentController.getCommentsBySong);

router.get(
    /*
    #swagger.path = '/api/comment/getComment/comment/{id}'
    #swagger.tags = ['Comments']
    #swagger.summary = 'Obtener comentario por ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del comentario (ej: 681457a757562da3002c02d6)',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Detalle del comentario',
        schema: {
            _id: '681f473536ee5347ec38543c',
            song_id: 213,
            user: 'Pepe',
            message: 'Prueba',
            parent_id: null,
            timestamp: '2025-05-10T12:31:49.254Z',
            responses: [],
            __v: 0
        }
    }
    #swagger.responses[404] = { description: 'Comentario no encontrado' }
    #swagger.responses[500] = { description: 'Error del servidor' }
    */
    '/getComment/comment/:id',
    commentController.getCommentById
);

//router.post('/response/:commentId/responses', commentController.addResponseToComment);

router.delete(
/*
#swagger.path = '/api/comment/delete/{id}'
#swagger.tags = ['Comments']
#swagger.summary = 'Eliminar comentario por ID'
#swagger.parameters['id'] = {
    in: 'path',
    description: 'ID del comentario (ej: 681457a757562da3002c02d6)',
    required: true,
    type: 'string'
}
#swagger.responses[204] = { description: 'Comentario eliminado exitosamente' }
#swagger.responses[404] = { description: 'Comentario no encontrado' }
#swagger.responses[500] = { description: 'Error del servidor' }
*/
    '/delete/:id', commentController.deleteComment);

module.exports = router;
