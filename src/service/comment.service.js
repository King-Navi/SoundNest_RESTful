const CommentRepository= require('../repositories/ComentarioRepository.mongo.repository');
const commentRepository = new CommentRepository();

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
    const rawComments = await commentRepository.getCommentsBySong(song_id);
    return rawComments.map(buildResponseTree); //Array
    return commentsTree;
  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    throw new Error('Error al obtener los comentarios');
  }
}

async function getCommentById(commentId) {
  try {
    const rawComment = await commentRepository.getCommentById(commentId);
    if (!rawComment) return null;
    return buildResponseTree(rawComment); // JUST ONE
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

  return {
    ...comentarioRaiz,
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
