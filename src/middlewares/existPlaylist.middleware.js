const PlaylistRepository  = require('../repositories/playlist.mongo.repository');
const { NonexistentPlaylist } = require('../service/exceptions/exceptions');

const playlistRepo = new PlaylistRepository();

/**
 * Middleware to validate that a playlist exists.
 * - Looks up the playlist by ID in `req.params.playlistId` (you can change this to `req.body` or wherever your app passes it).
 * - If it exists, attaches it to `req.playlist` and calls `next()`.
 * - If it doesn’t exist, `404`.
 */
async function validatePlaylistExists(req, res, next) {
  const { idPlaylist } = req.params;
  try {
    const playlist = await playlistRepo.getPlaylistById(idPlaylist);
    if (!playlist) {
      return res.status(404).send();
    }
    req.playlist = playlist;
    next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Error al validar el id"});
  }
}

module.exports = validatePlaylistExists;
