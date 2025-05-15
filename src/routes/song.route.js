const express = require("express");
const {
  getGenresController,
  getExtensionsController,
  getSongController,
  getSongRandomController,
  getSongRecentController,
  getMostPopularSongsController,
  searchSongController,
  getSongOfUserController,
  getLastUserSongController,
  updateImageSongController,
  deleteSongController,
} = require("../controllers/song.controller");
const {
  validateSearchQuery,
} = require("../middlewares/validateSongSearch.middleware");
const {
  validateParams,
  idParamSchema,
} = require("../middlewares/validateIdParams.middleware");
const autoriztion = require("../middlewares/auth.middleware");
const validateFileType = require("../middlewares/validateFileType");
const validateSongId = require("../middlewares/validateSongId.middleware");
const validateSongOwnership = require("../middlewares/validateSongOwnership.middleware");
const upload = require("../middlewares/uploadSongImage.middleware");
const router = express.Router();
/*
TODO:

EDITAR DESCRIPCION SONG
RECUPERAR DESCRIPCION SONG
EN GRPC FALTA descripcion en el modelo songs
*/
const SONG_BASIC_ROUTE = "/api/songs";

router.delete(
  /*
  #swagger.path = '/api/songs/:idsong/delete'
  #swagger.tags = ['Songs']
  #swagger.summary = 'Delete a song'
  #swagger.description = 'Deletes a song by its ID. Removes associated image and audio, then marks the record as deleted. Only the owner or an admin may perform this action.'

  #swagger.parameters['idsong'] = {
    description: 'ID of the song whose image will be deleted',
    required: true,
    type: 'integer'
  }
  */
  `${SONG_BASIC_ROUTE}/:idsong/delete`,
  autoriztion,
  validateSongId,
  validateSongOwnership,
  deleteSongController
);

router.patch(
  /*
    #swagger.path = '/api/songs/:idsong/image'
    #swagger.tags = ['Songs']
    #swagger.summary = 'Upload or update an image for a song'
    #swagger.description = 'Allows a user to upload or replace the image associated with a song. Only the owner of the song or an admin can perform this action.'

    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['idsong'] = {
      in: 'path',
      description: 'ID of the song whose image will be updated',
      required: true,
      type: 'integer'
    }

    #swagger.parameters['imagefile'] = {
      in: 'formData',
      type: 'file',
      required: true,
      description: 'Image file to be uploaded. Must be PNG or JPEG.',
      imagesTypes: ['image/png', 'image/jpeg']
    }

    #swagger.responses[400] = {
      description: 'Invalid file or missing required data',
      schema: { error: 'File not provided' }
    }

    #swagger.responses[403] = {
      description: 'User is not authorized to update this song image',
      schema: { error: 'Acceso denegado' }
    }

    #swagger.responses[404] = {
      description: 'Song not found',
      schema: { error: 'Canción no encontrada' }
    }

    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { error: 'Error al actualizar imagen: <mensaje>' }
    }
  */
  `${SONG_BASIC_ROUTE}/:idsong/image`,
  autoriztion,
  validateSongId,
  validateSongOwnership,
  upload.single("imagefile"),
  validateFileType,
  updateImageSongController
);

router.get(
  /*
    #swagger.path = '/api/songs/user/:idAppUser/lastest'
    #swagger.tags = ['Songs']
    #swagger.summary = 'Lastest song'
    #swagger.description = 'Returns the lastest song og the given user.'

    #swagger.parameters['idAppUser'] = {
      in: 'path',
      description: 'ID of the user (AppUser) whose songs are to be retrieved',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = {
      description: 'List of user songs returned successfully.',
      schema: {
        idSong: 1,
        songName: "Canción de Prueba",
        fileName: "cancion_prueba.mp3",
        durationSeconds: 180,
        releaseDate: "2025-05-14T00:15:46.000Z",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        userName: "juanito",
        description: "Example of descriptions",
        pathImageUrl: "protocol://host/rute/file.extension",
        visualizations: [
          {
            idVisualizations: 1,
            playCount: 10,
            period: "2025-05-01",
            idSong: 1
          },
          {
            idVisualizations: 2,
            playCount: 15,
            period: "2025-05-12",
            idSong: 1
          }
        ]
      }
    
    }

    #swagger.responses[400] = {
      description: 'Invalid user ID'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  `${SONG_BASIC_ROUTE}/user/:idAppUser/lastest`,
  validateParams(idParamSchema),
  getLastUserSongController
);

router.get(
  /*
    #swagger.path = '/api/songs/user/:idAppUser'
    #swagger.tags = ['Songs']
    #swagger.summary = 'Get all songs created by a user'
    #swagger.description = 'Returns a list of all songs uploaded by a given user.'

    #swagger.parameters['idAppUser'] = {
      in: 'path',
      description: 'ID of the user (AppUser) whose songs are to be retrieved',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = {
      description: 'List of user songs returned successfully.',
      schema: [{
        idSong: 1,
        songName: "Canción de Prueba",
        fileName: "cancion_prueba.mp3",
        durationSeconds: 180,
        releaseDate: "2025-05-14T00:15:46.000Z",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        userName: "juanito",
        description: "Example of descriptions",
        pathImageUrl: "protocol://host/rute/file.extension",
        visualizations: [
          {
            idVisualizations: 1,
            playCount: 10,
            period: "2025-05-01",
            idSong: 1
          },
          {
            idVisualizations: 2,
            playCount: 15,
            period: "2025-05-12",
            idSong: 1
          }
        ]
      }
    ]
    }

    #swagger.responses[400] = {
      description: 'Invalid user ID'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  `${SONG_BASIC_ROUTE}/user/:idAppUser`,
  validateParams(idParamSchema),
  getSongOfUserController
);

router.get(
  /*
  #swagger.path = '/api/songs/search'
    #swagger.tags = ['Songs']
    #swagger.summary = 'Get most popular songs with optional filters'
    #swagger.description = 'Recovers the most popular songs. Se debe enviar al menos uno de los filtros: songName, artistName o idGenre.'
    #swagger.parameters['songName'] = {
      in: 'query',
      description: 'Name of the song',
      required: false,
      type: 'string',
    }
    #swagger.parameters['artistName'] = {
      in: 'query',
      description: 'the name of the author of the song',
      required: false,
      type: 'string',
    }
    #swagger.parameters['idGenre'] = {
      in: 'query',
      description: 'idgenre of song',
      required: false,
      type: 'integer',
    }
     #swagger.parameters['limit'] = {
      in: 'query',
      name: 'limit',
      required: false,
      schema: {
        type: 'integer',
        default: 10,
        minimum: 1,
        maximum: 60
      },
      description: 'Máximo número de canciones a devolver (default: 10).'
    }
    #swagger.parameters['offset'] = {
      in: 'query',
      name: 'offset',
      required: false,
      schema: {
        type: 'integer',
        default: 0,
        minimum: 0
      },
      description: 'Número de canciones a omitir (default: 0).'
    }

    #swagger.responses[200] = {
      description: 'Lista de canciones devuelta exitosamente.',
      schema: [
        {
          idSong: 1,
          songName: "Canción de Prueba",
          fileName: "cancion_prueba.mp3",
          durationSeconds: 180,
          releaseDate: "2025-05-14T00:15:46.000Z",
          isDeleted: false,
          idSongGenre: 1,
          idSongExtension: 1,
          userName: "juanito",
          description: "Example of descriptions",
          pathImageUrl: "protocol://host/route/file.extension",
          visualizations: [
            { idVisualizations: 1, playCount: 10, period: "2025-05-01", idSong: 1 },
            { idVisualizations: 2, playCount: 15, period: "2025-05-12", idSong: 1 }
          ]
        }
      ]
    }
    #swagger.responses[400] = {
      description: 'Faltan todos los filtros obligatorios (se requiere al menos uno).',
      schema: { error: 'Debes enviar al menos uno de estos parámetros en query: songName, artistName o idGenre.' }
    }
    #swagger.responses[500] = {
      description: 'Error interno del servidor.',
      schema: { error: 'Mensaje de error genérico.' }
    }
  */
  `${SONG_BASIC_ROUTE}/search`,
  validateSearchQuery,
  searchSongController
);

router.get(
  /*
    #swagger.path = '/api/songs/:amount/popular/:year/:month'
    #swagger.tags = ['Songs']
    #swagger.summary = 'Get most popular songs by month'
    #swagger.description = 'Retrieves detailed information about the top songs in a given month and year, ordered by total playCount.'

    #swagger.parameters['amount'] = {
      in: 'path',
      description: 'Number of songs to retrieve (max 60)',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['year'] = {
      in: 'path',
      description: 'Four-digit year (e.g. 2025)',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['month'] = {
      in: 'path',
      description: 'Month number (1-12)',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = {
      description: 'List of most popular songs returned successfully.',
      schema: [
        {
          idSong: 1,
          songName: "Canción de Prueba",
          fileName: "cancion_prueba.mp3",
          durationSeconds: 180,
          releaseDate: "2025-05-14T00:15:46.000Z",
          isDeleted: false,
          idSongGenre: 1,
          idSongExtension: 1,
          userName: "juanito",
          description: "Example of descriptions",
          pathImageUrl: "protocol://host/route/file.extension",
          visualizations: [
            {
              idVisualizations: 1,
              playCount: 10,
              period: "2025-05-01",
              idSong: 1
            },
            {
              idVisualizations: 2,
              playCount: 15,
              period: "2025-05-12",
              idSong: 1
            }
          ]
        }
      ]
    }
    #swagger.responses[400] = {
      description: 'Invalid or missing parameter',
      schema: { error: "Invalid or missing 'amount'/'year'/'month' parameter" }
    }
    #swagger.responses[404] = {
      description: 'No popular songs found for the specified period',
      schema: { error: "Songs not found" }
    }
    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: { error: "Failed to fetch popular songs: <message>" }
    }
  */
  `${SONG_BASIC_ROUTE}/:amount/popular/:year/:month`,
  getMostPopularSongsController
);

router.get(
  /*
  #swagger.path = '/api/songs/:amount/recent'
  #swagger.tags = ['Songs']
  #swagger.summary = 'Get detailed information about recent songs (7 days ago max)'
  #swagger.description = 'Retrieves detailed information about songs of 7 days old max, including metadata, artist name, and visualization history.'
  #swagger.parameters['amount'] = {
      in: 'path',
      description: 'amount of the songs to retrieve',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = {
      description: 'Songs found and returned successfully.',
      schema: [{
        idSong: 1,
        songName: "Canción de Prueba",
        fileName: "cancion_prueba.mp3",
        durationSeconds: 180,
        releaseDate: "2025-05-14T00:15:46.000Z",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        userName: "juanito",
        description: "Example of descriptions",
        pathImageUrl: "protocol://host/rute/file.extension",
        visualizations: [
          {
            idVisualizations: 1,
            playCount: 10,
            period: "2025-05-01",
            idSong: 1
          },
          {
            idVisualizations: 2,
            playCount: 15,
            period: "2025-05-12",
            idSong: 1
          }
        ]
}]
    }
    #swagger.responses[400] = {
      "error": "Invalid or missing amount"
    }

    #swagger.responses[404] = {
      "error": "Songs not found"
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  `${SONG_BASIC_ROUTE}/:amount/recent`,
  getSongRecentController
);

router.get(
  /*
  #swagger.path = '/api/songs/:amount/random'
  #swagger.tags = ['Songs']
  #swagger.summary = 'Get detailed information about random songs'
  #swagger.description = 'Retrieves detailed information for random songs, including metadata, artist name, and visualization history.'

    #swagger.parameters['amount'] = {
      in: 'path',
      description: 'amount of the songs to retrieve',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = {
      description: 'Songs found and returned successfully.',
      schema: [{
        idSong: 1,
        songName: "Canción de Prueba",
        fileName: "cancion_prueba.mp3",
        durationSeconds: 180,
        releaseDate: "2025-05-14T00:15:46.000Z",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        userName: "juanito",
        description: "Example of descriptions",
        pathImageUrl: "protocol://host/rute/file.extension",
        visualizations: [
          {
            idVisualizations: 1,
            playCount: 10,
            period: "2025-05-01",
            idSong: 1
          },
          {
            idVisualizations: 2,
            playCount: 15,
            period: "2025-05-12",
            idSong: 1
          }
        ]
      }
    ]
    }
    #swagger.responses[400] = {
      "error": "Invalid or missing amount"
    }

    #swagger.responses[404] = {
      "error": "Songs not found"
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  `${SONG_BASIC_ROUTE}/:amount/random`,
  getSongRandomController
);

router.get(
  /*
    #swagger.path = '/api/songs/:idsong/song'
    #swagger.tags = ['Songs']
    #swagger.summary = 'Get detailed information about a song'
    #swagger.description = 'Retrieves detailed information for a specific song, including metadata, artist name, and visualization history.'

    #swagger.parameters['idsong'] = {
      in: 'path',
      description: 'ID of the song to retrieve',
      required: true,
      type: 'integer'
    }

    #swagger.responses[200] = {
      description: 'Song found and returned successfully.',
      schema: {
        idSong: 1,
        songName: "Canción de Prueba",
        fileName: "cancion_prueba.mp3",
        durationSeconds: 180,
        releaseDate: "2025-05-14T00:15:46.000Z",
        isDeleted: false,
        idSongGenre: 1,
        idSongExtension: 1,
        userName: "juanito",
        description: "Example of descriptions",
        pathImageUrl: "protocol://host/rute/file.extension",
        visualizations: [
          {
            idVisualizations: 1,
            playCount: 10,
            period: "2025-05-01",
            idSong: 1
          },
          {
            idVisualizations: 2,
            playCount: 15,
            period: "2025-05-12",
            idSong: 1
          }
        ]
      }
    }

    #swagger.responses[404] = {
      description: 'Song not found'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  `${SONG_BASIC_ROUTE}/:idsong/song`,
  getSongController
);

router.get(
  /* 
  #swagger.path = '/api/songs/genres'
  #swagger.tags = ['Songs']
  #swagger.description = 'Retrieves all available music genres.'
  #swagger.responses[200] = {
    description: 'List of music genres',
    schema: [
      { idSongGenre: 29, genreName: "Alternative" },
      { idSongGenre: 16, genreName: "Bachata" },
      { idSongGenre: 23, genreName: "Banda" },
      { idSongGenre: 4,  genreName: "Blues" }
    ]
  }
  #swagger.responses[500] = { description: 'Server error' }
*/
  `${SONG_BASIC_ROUTE}/genres`,
  getGenresController
);

router.get(
  /*
  #swagger.path = '/songs/extensions'
  #swagger.tags = ['Songs']
  #swagger.summary = 'Get all song file extensions'
  #swagger.description = 'Returns a list of available file extensions with their IDs.'
  #swagger.responses[200] = {
    description: 'Successful response - list of extensions',
    schema: [
      {
        idSongExtension: 1,
        extensionName: "mp3"
      },
      {
        idSongExtension: 2,
        extensionName: "wav"
      }
    ]
  }
  #swagger.responses[500] = { description: 'Server error while fetching extensions' }
*/
  `${SONG_BASIC_ROUTE}/extensions`,
  getExtensionsController
);

module.exports = router;
