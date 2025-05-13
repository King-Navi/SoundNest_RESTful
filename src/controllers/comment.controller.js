const { ValidationError } = require('sequelize');
const commentService = require('../service/comment.service');
const { NonexistentSong } = require('../service/exceptions/exceptions');

async function createComment(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No user info in request' });
  }
  const {id, username }= req.user;
  const { song_id, message } = req.body;
  try {
    await commentService.createComment(song_id, username, message, id );
    res.status(204).send();
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });

    }
    if (error instanceof NonexistentSong) {
      return res.status(error.statusCode).json({ error: error.message });

    }
    res.status(500).json({ error: error.message });
  }
}

async function getCommentsBySong(req, res) {
  const { song_id } = req.params;
  try {
    const comentarios = await commentService.getCommentsBySong(Number(song_id));
    if (comentarios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para esta canción' });
    }
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCommentById(req, res) {
  const { id } = req.params;
  try {
    const comentario = await commentService.getCommentById(id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addResponseToComment(req, res) {
  const { commentId } = req.params;
  const { user, message } = req.body;
  try {
    const respuesta = await commentService.addResponseToComment(commentId, user, message);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteComment(req, res) {
  const commentId = req.params.id;
  const {id:userId, role: userIdRol }= req.user;

  try {
    const comment = await commentService.getRawCommentAuthorId(commentId);

     if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.author_id !== userId && userIdRol !== 2) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    const comentarioEliminado = await commentService.deleteComment(commentId);
    if (!comentarioEliminado) {
      return res.status(404).json({ message: 'Comentario no encontrado para eliminar' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createComment,
  getCommentsBySong,
  getCommentById,
  addResponseToComment,
  deleteComment,
};
