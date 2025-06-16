const PlaylistRepository = require("../repositories/playlist.mongo.repository");
const playlistRepo = new PlaylistRepository();

/**
 * Middleware to validate that the authenticated user owns the playlist.
 * 
 * Steps:
 * - Retrieves the playlist ID from request parameters.
 * - Fetches the playlist from the repository.
 * - Checks if the playlist exists.
 * - Compares the playlist's creator ID with the authenticated user's ID.
 * - If the user is not the owner, returns HTTP 403 Forbidden.
 * 
 * On success, calls next() to continue request processing.
 */

async function validatePlaylistOwnership(req, res, next) {
  const { idPlaylist } = req.params;
  const idUser = req.user.id;
  if (!idPlaylist) {
    return res
      .status(400)
      .json({ error: "Playlist not loaded in the request" });
  }
  let playlistResult = await playlistRepo.getPlaylistById(idPlaylist);
  if (!playlistResult) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  if (idUser != playlistResult.creator_id) {
    return res.status(403).json({ error: "Access denege" });
  }
  next();
}

module.exports = {
  validatePlaylistOwnership,
};
