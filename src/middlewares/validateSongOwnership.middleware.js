const {ID_ROLE_ADMIN} = require('../repositories/user.repository')
async function validateSongOwnership (req, res, next){
  const song = req.song;
  if (!song) {
    return res.status(400).json({ error: "Song not loaded in the request" });
  }
  const isAdmin = Number(req.user.role) === ID_ROLE_ADMIN;
  const isAuthor = Number(song.idAppUser) === Number(req.user.id);
  if (!isAdmin && !isAuthor) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

module.exports = validateSongOwnership;
