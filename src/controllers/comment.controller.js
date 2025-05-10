const commentService = require('../service/comment.service');

async function createComment(req, res) {
  const { song_id, user, message } = req.body;
  try {
    const comentario = await commentService.createComment(song_id, user, message);
    res.status(204).send();
  } catch (error) {
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
  const { id } = req.params;
  try {
    const comentarioEliminado = await commentService.deleteComment(id);
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
