const mongoose = require("mongoose");
const { Comment } = require("../modelsMongo/comment");
const { ValidationError } = require("sequelize");

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
      if (error.name === "ValidationError") {
        for (let field in error.errors) {
          throw ValidationError(
            `Error in field "${field}": ${error.errors[field].message}`
          );
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
          parent_id: null,
        },
      },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent_id",
          as: "all_responses",
          depthField: "depth",
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    return comentarios;
  }

  /**
   * Retrieves a specific comment by its ID, along with all its child replies (and nested descendants),
   * using MongoDB `$graphLookup` to build a flat list of replies.
   *
   * This method does NOT build a hierarchical structure (that is done by `buildResponseTree` in the service).
   *
   * @param {string|ObjectId} commentId - The ID of the comment to retrieve.
   * @returns {Promise<Object|null>} The comment with an additional `all_responses` field,
   *                                 containing its descendant replies in a flat format.
   *
   * @example
   * const comment = await repo.getCommentById("66504b9f1138f2d8c4d7ab9a");
   * console.log(comment.all_responses); // → [{...}, {...}, {...}]
   */
  async getCommentById(commentId) {
    const [comentario] = await Comment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent_id",
          as: "all_responses",
          depthField: "depth",
        },
      },
    ]);

    return comentario || null;
  }

  async getRawCommentById(commentId) {
    return await Comment.findById(commentId).lean();
  }

  async addResponseToComment(parentCommentId, user, message, userId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new Error("Comentario padre no encontrado");
    }

    const respuesta = new Comment({
      song_id: parentComment.song_id,
      author_id: userId,
      user,
      message,
      parent_id: parentCommentId,
    });

    await respuesta.save();
    return respuesta;
  }

  /**
   * Retrieves all replies associated with a comment, regardless of their hierarchical level,
   * and returns them as a flat (non-nested) list.
   *
   * Useful for "moderation" views or "full response lists" where hierarchy is not relevant.
   *
   * @param {string|ObjectId} commentId - The ID of the root comment from which to fetch all replies.
   * @returns {Promise<Array<Object>>} Array of all child comments (direct, indirect, etc.).
   *
   * @example
   * const responses = await repo.getFlatResponsesByCommentId("66504b9f1138f2d8c4d7ab9a");
   * console.log(responses); // → [{...}, {...}, {...}]
   */
  async getFlatResponsesByCommentId(commentId) {
    const [result] = await Comment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent_id",
          as: "all_responses",
        },
      },
      {
        $project: {
          _id: 0,
          all_responses: 1,
        },
      },
    ]);

    return result?.all_responses || [];
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

module.exports = CommentRepository;
