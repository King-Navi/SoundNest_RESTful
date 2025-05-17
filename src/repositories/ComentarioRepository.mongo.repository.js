const mongoose = require('mongoose');
const { Comment } = require('../modelsMongo/comment');
const { ValidationError } = require('sequelize');

class CommentRepository {
  async createComment(songId, user, message, userId) {
    try {
      const comentario = new Comment({
        song_id: songId,
        author_id: userId,
        user,
        message,
      });

      await comentario.save();
      return comentario;
    } catch (error) {
      if (error.name === 'ValidationError') {
        for (let field in error.errors) {
          throw ValidationError(`Error in field "${field}": ${error.errors[field].message}`);
        }
      } else {
        throw error;
      }
    }
  }

  async getCommentsBySong(songId) {
    const comentarios = await Comment.aggregate([
      {
        $match: {
          song_id: songId,
          parent_id: null // solo comentarios raíz
        }
      },
      {
        $graphLookup: {
          from: 'comments',          // colección objetivo
          startWith: '$_id',         // desde cada comentario raíz
          connectFromField: '_id',   // campo propio
          connectToField: 'parent_id', // conecta con este campo de hijos
          as: 'all_responses',       // el resultado se guarda aquí
          depthField: 'depth'        // opcional: indica profundidad
        }
      },
      {
        $sort: { timestamp: -1 } //más recientes primero
      }
    ]);
  
    return comentarios;
  }
  

  async getCommentById(commentId) {
    const [comentario] = await Comment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(commentId)
        }
      },
      {
        $graphLookup: {
          from: 'comments',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent_id',
          as: 'all_responses',
          depthField: 'depth'
        }
      }
    ]);
  
    return comentario || null;
  }

  async getRawCommentById(commentId) {
    return await Comment.findById(commentId).lean();
  }

  async addResponseToComment(parentCommentId, user, message, userId) {
    const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new Error('Comentario padre no encontrado');
  }

  const respuesta = new Comment({
    song_id: parentComment.song_id,
    author_id: userId, 
    user,
    message,
    parent_id: parentCommentId
  });

  await respuesta.save();
  return respuesta;
  }

  async deleteComment(commentId) {
    return await this._deleteRecursive(commentId);
  }

  async _deleteRecursive(commentId) {
    const children = await Comment.find({ parent_id: commentId });
    for (const child of children) {
      await this._deleteRecursive(child._id);
    }
    const deleted = await Comment.findByIdAndDelete(commentId);
    return deleted;
  }
}

module.exports = CommentRepository

