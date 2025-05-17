const Joi = require("joi");
const { getSongById } = require("../repositories/song.repository");
const { NotFoundError } = require("../repositories/exceptions/song.exceptions");

async function validateSongId(req, res, next) {
  const schema = Joi.object({
    idsong: Joi.number().integer().positive().required(),
  }).unknown(true);

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: "ID de canción inválido (formato)" });
  }

  try {
    const songId = Number(req.params.idsong);
    if (!songId) {
      return res.status(404).json({ error: "You need to provide a songId" });
    }
    const song = await getSongById(songId);

    if (!song) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    req.song = song;
    next();
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(400).json({ error: "ID de canción inválido (formato)" });
    }
    return res
      .status(500)
      .json({ error: "Error interno al validar ID de canción" });
  }
};

module.exports = validateSongId;
