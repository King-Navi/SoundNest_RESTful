const { ID_ROLE_ADMIN } = require("../repositories/user.repository");

/**
 * Middleware to validate ownership or admin rights for a song.
 * 
 * Checks if the song is loaded in the request (`req.song`).
 * Then verifies if the authenticated user (`req.user`) is either:
 * - An administrator (role matches `ID_ROLE_ADMIN`), or
 * - The author/owner of the song (`song.idAppUser` matches `req.user.id`).
 * 
 * If neither condition is met, responds with HTTP 403 (Forbidden).
 * If the song is not loaded in the request, responds with HTTP 400 (Bad Request).
 * Otherwise, calls `next()` to continue processing.
 * 
 * @param {Object} req - Express request object; expects `req.song` and `req.user`
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

async function validateSongOwnership(req, res, next) {
  const song = req.song;
  if (!song) {
    return res.status(400).json({ error: "Song not loaded in the request" });
  }
  const isAdmin = Number(req.user.role) === ID_ROLE_ADMIN;
  const isAuthor = Number(song.idAppUser) === Number(req.user.id);
  if (!isAdmin && !isAuthor) {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
}

module.exports = validateSongOwnership;
