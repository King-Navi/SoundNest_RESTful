const { 
  createPlaylistService, 
  deletePlaylistService, 
  addSongToPlaylistService,
  removeSongToPlaylistService,
  getPlaylistService,
  editPlaylistService,
  cleanPlaylistSongs,
} = require("../service/playlist.service");
const {NonexistentPlaylist, SongAlreadyInPlaylist, SongNotInPlaylist} =require('../service/exceptions/exceptions'); 

async function cleanListSongController(req, res) {
  const { idPlaylist } = req.params;
  try {
    const removedIds = await cleanPlaylistSongs(idPlaylist);
    return res.status(200).json({ removedIds });
  } catch (err) {
    if (err instanceof NonexistentPlaylist) {
      return res.status(404).json({ error: err.message });
    }
    console.error('[cleanListSongController] Error:', err);
    return res.status(500).json({ error: 'Error trying to clean the playlist' });
  }
}

async function editPlaylistController(req, res) {
  const { idPlaylist } = req.params;
  const userId = req.user.id;
  const allowed = ['playlist_name', 'description'];
  const received = Object.keys(req.body);
  const invalid = received.filter(key => !allowed.includes(key));
  if (invalid.length > 0) {
    return res
      .status(400)
      .json({ error: `Campos no permitidos: ${invalid.join(', ')}` });
  }
  if (!received.length) {
    return res
      .status(400)
      .json({ error: 'Debe incluir al menos playlist_name o description' });
  }
  const payload = {
    playlist_name: req.body.playlist_name,
    description:   req.body.description,
  };

  try {
    const updated = await editPlaylistService(
      idPlaylist,
      userId,
      payload
    );
    return res.json(updated);

  } catch (err) {
    if (err instanceof NonexistentPlaylist) {
      return res.status(404).json({ error: err.message });
    }

    console.error('[editPlaylistController] Error:', err);
    return res.status(500).json({ error: 'Error al editar la playlist' });
  }
}

async function getPlaylistByIdControlller(req, res) {
  try {
    return res.status(200).json(req.playlist);
  } catch (error) {
    res.status(500).json({ error: "Error trying to get the playlsit"});
  }
}

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
  fecthPlaylistController,
  getPlaylistByIdControlller,
  editPlaylistController,
  cleanListSongController
};
