const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadPlaylistImage.middleware');
const { uploadPlaylistImageController } = require('../controllers/uploadPlaylistImage.controller');
const authorization = require("../middlewares/auth.middleware");
const validateFileType = require('../middlewares/validateFileType');
const validateNewPlaylist = require('../middlewares/validatePlaylist.middleware');
/*
PUT Create New PlayList

PATCH ADD SONG TO PLAYLIST

DELETE new Playlist
*/
const PLAYLIST_BASIC_ROUTE = "/api/playlist"

router.post(
    /*
    
    MAXIMO 20 MB
    SOLO PNG Y JGP
    TIENE QUE TENER playlistname, y el file en form-data
    JWT NECESARIO 
    OPCIONAL description
    */
    `${PLAYLIST_BASIC_ROUTE}/upload`,
    authorization, 
    upload.single('image'),
    validateFileType(),                 
    validateNewPlaylist(),
    uploadPlaylistImageController
);

//TODO ACCES TO A PLAULIST FOR IDPLAYLSIT AND FOR IDUSER
// router.get(
//   '/:id',
//   authorization,
//   canAccessPlaylist(),
//   getPlaylistController //TODO
// );

module.exports = router;