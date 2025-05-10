const { Comment, Response } = require('../modelsMongo/comment'); 

class CommentRepository {
  async createComment(songId, user, message) {
    const comentario = new Comment({
      song_id: songId,
      user,
      message,
    });

    try {
      await comentario.save();
      return comentario;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  }

  async getCommentsBySong(songId) {
    try {
      const comentarios = await Comment.find({ song_id: songId })
        .populate({
          path: 'responses',
          populate: {
            path: 'responses',
            model: 'Response',
          },
        })
        .exec();
      return comentarios;
    } catch (error) {
      console.error('Error al obtener comentarios por canción:', error);
      throw error;
    }
  }

  async getCommentById(commentId) {
    try {
      const comentario = await Comment.findById(commentId)
        .populate({
          path: 'responses',
          populate: {
            path: 'responses',
            model: 'Response',
          },
        })
        .exec();
      return comentario;
    } catch (error) {
      console.error('Error al obtener comentario por ID:', error);
      throw error;
    }
  }

  async addResponseToComment(commentId, user, message) {
    try {
      const comentario = await Comment.findById(commentId);
      const respuesta = new Response({
        user,
        message,
        parent_id: commentId,
      });

      await respuesta.save();
      comentario.responses.push(respuesta);
      await comentario.save();

      return respuesta;
    } catch (error) {
      console.error('Error al agregar respuesta:', error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      const comentario = await Comment.findByIdAndDelete(commentId);
      if (comentario) {
        await Response.deleteMany({ parent_id: commentId });
      }
      return comentario;
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  }
}

module.exports = {
  CommentRepository
};
