const { Response } = require("../modelsMongo/comment");

class ResponseRepository {
  async createResponse(user, message, parentId) {
    const respuesta = new Response({
      user,
      message,
      parent_id: parentId,
    });

    try {
      await respuesta.save();
      return respuesta;
    } catch (error) {
      console.error("Error al crear respuesta:", error);
      throw error;
    }
  }

  async getResponseById(responseId) {
    try {
      const respuesta = await Response.findById(responseId).exec();
      return respuesta;
    } catch (error) {
      console.error("Error al obtener respuesta por ID:", error);
      throw error;
    }
  }

  async getResponsesByCommentId(commentId) {
    try {
      const respuestas = await Response.find({ parent_id: commentId }).exec();
      return respuestas;
    } catch (error) {
      console.error("Error al obtener respuestas por comentario:", error);
      throw error;
    }
  }

  async deleteResponse(responseId) {
    try {
      const respuesta = await Response.findById(responseId);
      if (respuesta.responses && respuesta.responses.length > 0) {
        await Response.deleteMany({ _id: { $in: respuesta.responses } });
      }

      const respuestaEliminada = await Response.findByIdAndDelete(responseId);
      return respuestaEliminada;
    } catch (error) {
      console.error("Error al eliminar respuesta y sus respuestas:", error);
      throw error;
    }
  }

  async deleteResponseAndNestedResponses(responseId) {
    try {
      const respuesta = await Response.findById(responseId);
      if (respuesta.responses && respuesta.responses.length > 0) {
        for (let subRespuestaId of respuesta.responses) {
          await this.deleteResponseAndNestedResponses(subRespuestaId);
        }
      }
      const respuestaEliminada = await Response.findByIdAndDelete(responseId);
      return respuestaEliminada;
    } catch (error) {
      console.error("Error al eliminar respuesta y sus respuestas:", error);
      throw error;
    }
  }
}

module.exports = new ResponseRepository();
