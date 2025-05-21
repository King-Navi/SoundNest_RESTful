const CommentRepository= require('../repositories/ComentarioRepository.mongo.repository');
const commentRepository = new CommentRepository();

const { NonexistentSong } = require('./exceptions/exceptions');
const {
  verifySongExists
} = require('../repositories/song.repository');


async function createComment(song_id, user, message, idUser) {
  try {
    await existSong(song_id);
    return await commentRepository.createComment(song_id, user, message, idUser);
  } catch (error) {
    throw error;
  }
}

async function existSong(song_id) {
  if (await verifySongExists(song_id)) {
    return true;
  }
  throw new NonexistentSong("The id song does not exist")
}

async function getCommentsBySong(song_id) {
  try {
    const rawComments = await commentRepository.getCommentsBySong(song_id);
    return rawComments.map(buildResponseTree);
  } catch (error) {
    throw new Error('Error al obtener los comentarios');
  }
}

async function getCommentById(commentId) {
  try {
    const rawComment = await commentRepository.getCommentById(commentId);
    if (!rawComment) return null;
    return buildResponseTree(rawComment);
  } catch (error) {
    console.error('Error al obtener el comentario por ID:', error);
    throw new Error('Error al obtener el comentario');
  }
}

async function addResponseToComment(commentId, user, message, idUser) {
  try {
    return await commentRepository.addResponseToComment(commentId, user, message,idUser);
  } catch (error) {
    console.error('Error al agregar la respuesta al comentario:', error);
    throw new Error('Error al agregar la respuesta');
  }
}

async function deleteComment(commentId) {
  try {
    return await commentRepository.deleteComment(commentId);
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    throw new Error('Error al eliminar el comentario');
  }
}

/**
 * Construye un árbol de respuestas a partir de un comentario raíz y su lista de respuestas planas.
 *
 * @param {Object} comentarioRaiz - El comentario raíz que contiene la propiedad `all_responses`,
 *                                   una lista plana de todas las respuestas relacionadas.
 * @returns {Object} Una estructura que representa el comentario raíz con las respuestas
 *                   anidadas jerárquicamente bajo la propiedad `responses`.
 */
function buildResponseTree(comentarioRaiz) {
  const all = comentarioRaiz.all_responses;
  const responseMap = new Map();

  for (const res of all) {
    responseMap.set(res._id.toString(), { ...res, responses: [] });
  }

  const tree = [];

  for (const res of all) {
    const parentId = res.parent_id?.toString();
    if (parentId === comentarioRaiz._id.toString()) {
      tree.push(responseMap.get(res._id.toString()));
    } else if (responseMap.has(parentId)) {
      responseMap.get(parentId).responses.push(responseMap.get(res._id.toString()));
    }
  }
  const { all_responses, ...limpio } = comentarioRaiz;

  return {
    ...limpio,
    responses: tree
  };
}


module.exports = {
  createComment,
  getCommentsBySong,
  getCommentById,
  addResponseToComment,
  deleteComment,
};
