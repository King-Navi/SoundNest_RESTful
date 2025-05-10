const { CommentRepository } = require('../repositories/ComentarioRepository.mongo.repository');
const commentRepository = new CommentRepository();
const responseRepository = require('../repositories/ResponseRepository.mongo.repository');

async function createComment(song_id, user, message) {
  try {
    const comentario = await commentRepository.createComment(song_id, user, message);
    return comentario;
  } catch (error) {
    console.error('Error en la creación del comentario:', error);
    throw new Error('Error en la creación del comentario');
  }
}

async function getCommentsBySong(song_id) {
  try {
    const comentarios = await commentRepository.getCommentsBySong(song_id);
    return comentarios;
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    throw new Error('Error al obtener los comentarios');
  }
}

async function getCommentById(commentId) {
  try {
    const comentario = await commentRepository.getCommentById(commentId);
    return comentario;
  } catch (error) {
    console.error('Error al obtener el comentario por ID:', error);
    throw new Error('Error al obtener el comentario');
  }
}

async function addResponseToComment(commentId, user, message) {
  try {
    const respuesta = await commentRepository.addResponseToComment(commentId, user, message);
    return respuesta;
  } catch (error) {
    console.error('Error al agregar la respuesta al comentario:', error);
    throw new Error('Error al agregar la respuesta');
  }
}

async function deleteComment(commentId) {
  try {
    const comentarioEliminado = await commentRepository.deleteComment(commentId);
    return comentarioEliminado;
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    throw new Error('Error al eliminar el comentario');
  }
}

module.exports = {
  createComment,
  getCommentsBySong,
  getCommentById,
  addResponseToComment,
  deleteComment,
};
