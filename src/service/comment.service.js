const CommentRepository = require("../repositories/ComentarioRepository.mongo.repository");
const commentRepository = new CommentRepository();

const { NonexistentSong } = require("./exceptions/exceptions");
const { verifySongExists } = require("../repositories/song.repository");

async function createComment(song_id, user, message, idUser) {
  try {
    await existSong(song_id);
    return await commentRepository.createComment(
      song_id,
      user,
      message,
      idUser
    );
  } catch (error) {
    throw error;
  }
}

async function existSong(song_id) {
  if (await verifySongExists(song_id)) {
    return true;
  }
  throw new NonexistentSong("The id song does not exist");
}

async function getCommentsBySong(song_id) {
  try {
    const rawComments = await commentRepository.getCommentsBySong(song_id);
    return rawComments.map(buildResponseTree);
  } catch (error) {
    throw new Error("Error al obtener los comentarios");
  }
}

async function getCommentById(commentId) {
  try {
    const rawComment = await commentRepository.getCommentById(commentId);
    if (!rawComment) return null;
    return buildResponseTree(rawComment);
  } catch (error) {
    if (process.env.ENVIROMENT === "development") {
      console.error("Error al obtener el comentario por ID:", error);
    }
    throw new Error("Error al obtener el comentario");
  }
}

async function addResponseToComment(commentId, user, message, idUser) {
  try {
    return await commentRepository.addResponseToComment(
      commentId,
      user,
      message,
      idUser
    );
  } catch (error) {
    if (process.env.ENVIROMENT === "development") {
      console.error("Error al agregar la respuesta al comentario:", error);
    }
    throw new Error("Error al agregar la respuesta");
  }
}

async function deleteComment(commentId) {
  try {
    return await commentRepository.deleteComment(commentId);
  } catch (error) {
    if (process.env.ENVIROMENT === "development") {
      console.error("Error al eliminar el comentario:", error);
    }
    throw new Error("Error al eliminar el comentario");
  }
}

/**
 * Builds a response tree from a root comment and its flat list of replies.
 *
 * @param {Object} comentarioRaiz - The root comment containing the `all_responses` property,
 *                                a flat list of all related replies.
 * @returns {Object} A structure representing the root comment with replies
 *                   nested hierarchically under the `responses` property.
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
      responseMap
        .get(parentId)
        .responses.push(responseMap.get(res._id.toString()));
    }
  }
  const { all_responses, ...limpio } = comentarioRaiz;

  return {
    ...limpio,
    responses: tree,
  };
}

/**
 * Retrieves all replies to a comment (regardless of depth),
 * and returns them as a flat list.
 *
 * @param {string} commentId - The ID of the root comment.
 * @returns {Promise<Array<Object>>} List of all replies in a flat structure.
 */
async function getFlatResponses(commentId) {
  try {
    return await commentRepository.getFlatResponsesByCommentId(commentId);
  } catch (error) {
    if (process.env.ENVIROMENT === "development") {
      console.error("Error al obtener el comentario por ID:", error);
    }
    throw new Error("Error al obtener respuestas del comentario");
  }
}

module.exports = {
  createComment,
  getCommentsBySong,
  getCommentById,
  addResponseToComment,
  deleteComment,
  getFlatResponses,
};
