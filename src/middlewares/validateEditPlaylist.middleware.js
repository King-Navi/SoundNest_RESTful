const Joi = require("joi");

const editPlaylistSchema = Joi.object({
  playlist_name: Joi.string().max(100),
  description: Joi.string().max(500),
}).or("playlist_name", "description");

function validateEditPlaylist(req, res, next) {
  const { error } = editPlaylistSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error: "Invalid input",
      details: error.details.map(detail => detail.message),
    });
  }

  next();
}

module.exports = {
    validateEditPlaylist
};
