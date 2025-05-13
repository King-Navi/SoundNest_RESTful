const express = require("express");
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { validateNewComment } = require("../middlewares/validateNewComment.middleware");
const { validateResponseSchema } = require("../middlewares/validateNewCommentResponse.middlware");
const authorization = require("../middlewares/auth.middleware");

const COMMENT_BASIC_ROUTE = "/api/comment"


router.post(
/*
#swagger.path = '/api/comment/{commentId}/respondComment'
#swagger.tags = ['Comments']
#swagger.summary = 'Responder a un comentario existente'
#swagger.parameters['commentId'] = {
    in: 'path',
    description: 'ID del comentario al que se desea responder',
    required: true,
    type: 'integer',
    example: 5
}
#swagger.parameters['body'] = {
    in: 'body',
    description: 'Contenido de la respuesta al comentario',
    required: true,
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Estoy de acuerdo contigo' }
        },
        required: ['message']
    }
}
#swagger.responses[204] = { description: 'Respuesta agregada exitosamente al comentario' }
#swagger.responses[401] = { description: 'Unauthorized' }
#swagger.responses[404] = { description: 'Comentario no encontrado' }
#swagger.responses[500] = { description: 'Error del servidor' }
*/
    `${COMMENT_BASIC_ROUTE}/:commentId/respondComment`,
    authorization, 
    validateResponseSchema , 
    commentController.addResponseToComment
);


router.post(
/*
#swagger.path = '/api/comment/createComment'
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
            message: { type: 'string', example: 'any' }
        },
        required: ['song_id', 'message']
    }
}
#swagger.responses[204] = { description: 'Comentario creado exitosamente' }
#swagger.responses[401] = { description: 'Unauthorized' }
#swagger.responses[404] = { description: 'Nonexistent song' }
#swagger.responses[500] = { description: 'Error del servidor' }
*/
    `${COMMENT_BASIC_ROUTE}/createComment`,
    authorization,
    validateNewComment,
    commentController.createComment
);

router.get(
/*
    #swagger.path = '/api/comment/getComment/:song_id/comments'
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
    #swagger.path = '/api/comment/getComment/comment/:id'
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
#swagger.responses[404] = { description: 'Lack of permissions'}
#swagger.responses[500] = { description: 'Error del servidor' }
*/
    `${COMMENT_BASIC_ROUTE}/delete/:id`,authorization, commentController.deleteComment
);

module.exports = router;
