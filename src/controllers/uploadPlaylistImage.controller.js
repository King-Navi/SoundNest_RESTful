const { 
  createPlaylistService, 
  deletePlaylistService, 
  addSongToPlaylistService,
  removeSongToPlaylistService,
  getPlaylistService,
} = require("../service/playlist.service");
const {NonexistentPlaylist, SongAlreadyInPlaylist, SongNotInPlaylist} =require('../service/exceptions/exceptions'); 

async function fecthPlaylistController(req, res) {
  try {
    const { iduser } = req.params;
    const playlists = await getPlaylistService(iduser);
    return res.status(200).json({ playlists });
  } catch (error) {
    if (error instanceof NonexistentPlaylist) {
      return res.status(404).json({ error: error.message});
    }
    console.warn(error)
    res.status(500).json({ error: "Error trying to delete the playlsit CALL NAVI "});
  }
}

async function removeSongToPlaylistController(req, res) {
  try {
    const { idPlaylist, idsong } = req.params
    await removeSongToPlaylistService(idPlaylist, idsong);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NonexistentPlaylist) {
      return res.status(404).json({ error: error.message});
    }
    if (error instanceof SongNotInPlaylist) {
      return res.status(error.statusCode).json({ error: error.message});
    }
    console.warn(error)
    res.status(500).json({ error: "Error trying to delete the playlsit CALL NAVI "});
  }
}


async function addSongToPlaylistController(req, res) {
  try {
    const { idPlaylist, idsong } = req.params
    await addSongToPlaylistService(idPlaylist, idsong);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NonexistentPlaylist) {
      return res.status(404).json({ error: error.message});
    }
    if (error instanceof SongAlreadyInPlaylist) {
      return res.status(error.statusCode).json({ error: error.message});
    }
    console.warn(error)
    res.status(500).json({ error: "Error trying to delete the playlsit CALL NAVI "});
  }
}


async function deletePlaylistController(req, res) {
  try {
    const { idPlaylist } = req.params
    await deletePlaylistService(idPlaylist);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NonexistentPlaylist) {
      return res.status(404).json({ error: error.message});
    }
    res.status(500).json({ error: "Error trying to delete the playlsit CALL NAVI "});
  }
}

async function uploadPlaylistImageController(req, res) {
  try {
    const { playlistName, description } = req.body;
    const userId = req.user.id;
    /*
    file
    {
      fieldname: 'image', (por ejemplo, "image" si usaste upload.single('image'))
      originalname: 'cover.png',  como lo subió el usuario
      encoding: '7bit',
      mimetype: 'image/png',
      destination: 'uploads/playlist_image',
      filename: '1715465678901-cover.png', Nombre del archivo generado por Multer en el servidor 
      path: 'uploads/playlist_image/1715465678901-cover.png',
      size: 458721
    }
    */
    const fileName = req._uploadedFileName;
    const tempPath = req.file.path;
    if (!fileName || !tempPath) {
      return res.status(400).json({ error: 'Missing uploaded file or path' });
    }
    const playlist = await createPlaylistService({
      userId,
      playlistName,
      description,
      fileName,
      tempPath,
    });
    return res.status(201).json({
      message: 'Playlist created successfully',
      playlist,
    });
  } catch (error) {
    console.error('[uploadPlaylistImageController] Error:', error);
    res.status(500).json({ error: "Failed to process image upload. "});
  }
}

module.exports = {
  uploadPlaylistImageController,
  deletePlaylistController,
  addSongToPlaylistController,
  removeSongToPlaylistController,
  fecthPlaylistController
};
