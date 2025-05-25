const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadPlaylistImage.middleware");
const {
  uploadPlaylistImageController,
  deletePlaylistController,
  addSongToPlaylistController,
  removeSongToPlaylistController,
  fecthPlaylistController,
  getPlaylistByIdControlller,
  editPlaylistController,
  cleanListSongController,
  uploadPlaylistImageBase64Controller,
} = require("../controllers/uploadPlaylistImage.controller");
const authorization = require("../middlewares/auth.middleware");
const validateFileType = require("../middlewares/validateFileType");
const validateNewPlaylist = require("../middlewares/validatePlaylist.middleware");
const {
  validatePlaylistOwnership,
} = require("../middlewares/validatePlaylistOwnership.middleware");
const existPlaylist = require("../middlewares/existPlaylist.middleware");
const validateIdSong = require("../middlewares/validateSongId.middleware");
const validateNewPlaylistBase64 = require("../middlewares/validateNewPlaylistBase64.middleware");
const validateImageBase64Format = require("../middlewares/base64IsImage.middleware");

const PLAYLIST_BASIC_ROUTE = "/api/playlist";

router.patch(
  /*
 #swagger.path = '/api/playlist/list/:idPlaylist/clean'
 #swagger.tags = ['Playlists']
 #swagger.summary = 'Clean deleted songs from playlist'
 #swagger.description = 'Removes songs marked as deleted from the playlist and returns the list of removed song IDs.'
 #swagger.parameters['Authorization'] = {
   in: 'header',
   name: 'Authorization',
   required: true,
   type: 'string',
   description: 'Bearer JWT token'
 }
 #swagger.parameters['idPlaylist'] = {
   in: 'path',
   name: 'idPlaylist',
   required: true,
   type: 'string',
   description: 'MongoDB ObjectId of the playlist to clean',
   example: '682e2b4697981929a82b9ce6'
 }
 #swagger.responses[200] = {
   description: 'Array of removed song IDs successfully returned',
   schema: {
     type: 'array',
     items: { type: 'integer' },
     example: [3, 7, 15]
   }
 }
 #swagger.responses[401] = {
   description: 'Unauthorized – missing or invalid token',
   schema: { message: 'No token provided' }
 }
 #swagger.responses[403] = {
   description: 'Forbidden – user is not the owner of the playlist',
   schema: { error: 'Access denied' }
 }
 #swagger.responses[404] = {
   description: 'Playlist not found',
   schema: { error: 'Playlist with id 682e2b4697981929a82b9ce6 not found' }
 }
 #swagger.responses[500] = {
   description: 'Internal server error',
   schema: { error: 'Error trying to clean the playlist' }
 }
 */
  `${PLAYLIST_BASIC_ROUTE}/list/:idPlaylist/clean`,
  authorization,
  validatePlaylistOwnership,
  cleanListSongController
);

router.patch(
  /*
   #swagger.path = '/api/playlist/edit/:idPlaylist'
   #swagger.tags = ['Playlists']
   #swagger.summary = 'Edit a playlist'
   #swagger.description = 'Edits the name and description of an existing playlist. Only the playlist owner can perform this action.'
 
   #swagger.parameters['idPlaylist'] = {
     required: true,
     type: 'string',
     description: 'MongoDB ObjectId of the playlist to edit',
     example: '682e2b4697981929a82b9ce6'
   }
   #swagger.parameters['body'] = {
     required: true,
     schema: {
       type: 'object',
       properties: {
         playlist_name: {
           type: 'string',
           description: 'New playlist name',
           example: 'My Updated Playlist Title'
         },
         description: {
           type: 'string',
           description: 'New playlist description',
           example: 'A fresh new description for my playlist'
         }
       }
     }
   }
   #swagger.responses[200] = {
     description: 'Playlist successfully updated',
     schema: {
       _id:           '682e2b4697981929a82b9ce6',
       creator_id:    2,
       playlist_name: 'My Updated Playlist Title',
       description:   'A fresh new description for my playlist',
       image_path:    '31c3e318-7f63-47eb-b08c-61407400089b.png',
       songs:         [],
       createdAt:     '2025-05-21T19:36:38.676Z',
       __v:           0
     }
   }
 */
  `${PLAYLIST_BASIC_ROUTE}/edit/:idPlaylist`,
  authorization,
  existPlaylist,
  validatePlaylistOwnership,
  editPlaylistController
);

router.get(
  /**
  #swagger.path = '/api/playlist/one/:idPlaylist'
  #swagger.tags = ['Playlists']
  #swagger.summary = 'Get a single playlist by its ID'
  #swagger.description = 'Returns the playlist document for the given MongoDB ObjectId. Requires the playlist to exist.'
  
  #swagger.parameters['idPlaylist'] = {
    in: 'path',
    name: 'idPlaylist',
    required: true,
    type: 'string',
    description: 'MongoDB ObjectId of the playlist to retrieve',
    example: '682e2b4697981929a82b9ce6'
  }

  #swagger.responses[200] = {
    description: 'Playlist successfully retrieved',
    schema: {
      _id: '682e2b4697981929a82b9ce6',
      creator_id: 2,
      playlist_name: 'playlist 1',
      description: 'cumbias',
      image_path: '31c3e318-7f63-47eb-b08c-61407400089b.png',
      songs: [],
      createdAt: '2025-05-21T19:36:38.676Z',
      __v: 0
    }
  }

  #swagger.responses[404] = {
    description: 'Playlist not found',
    schema: { error: 'Playlist with id 682e2b4697981929a82b9ce6 not found' }
  }

  #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { error: 'Error trying to get the playlist' }
  }
*/
  `${PLAYLIST_BASIC_ROUTE}/one/:idPlaylist`,
  existPlaylist,
  getPlaylistByIdControlller
);

router.get(
  /*
    #swagger.path = '/api/playlist/:iduser/user'
    #swagger.tags = ['Playlists']
    #swagger.summary = 'Get all playlists by user ID'
    #swagger.description = 'Returns all playlists created by the specified user. Each playlist includes its metadata and the list of songs added.'

    #swagger.parameters['iduser'] = {
      in: 'path',
      name: 'iduser',
      required: true,
      type: 'integer',
      description: 'Numeric ID of the user whose playlists will be fetched',
      example: 2
    }

    #swagger.responses[200] = {
      description: 'List of playlists successfully retrieved',
      schema: {
        playlists: [
          {
            _id: "6827f670c85a6289a67f3637",
            creator_id: 2,
            playlist_name: "pruebas",
            description: "adaddadada",
            image_path: "530900bb-c533-4435-aa1f-aa3335604a5c.png",
            songs: [],
            createdAt: "2025-05-17T02:37:36.009Z",
            __v: 0
          },
          {
            _id: "6827f677c85a6289a67f363d",
            creator_id: 2,
            playlist_name: "pruebas",
            description: "adaddadada",
            image_path: "bf7b7514-d1c0-45cf-9924-2fc6da45da50.png",
            songs: [
              {
                song_id: 1,
                addedAt: "2025-05-17T02:43:20.530Z",
                _id: "6827f7c8923bf2c987721306"
              }
            ],
            createdAt: "2025-05-17T02:37:43.622Z",
            __v: 3
          }
        ]
      }
    }

    #swagger.responses[500] = {
      description: 'Internal server error',
      schema: {
        error: 'Error trying to fetch the playlist. CALL NAVI'
      }
    }
  */
  `${PLAYLIST_BASIC_ROUTE}/:iduser/user`,
  fecthPlaylistController
);

router.patch(
  /*
  #swagger.path = '/api/playlist/:idsong/:idPlaylist/remove'
  #swagger.tags = ['Playlists']
  #swagger.summary = 'Remove a song from a playlist'
  #swagger.description = 'Removes a song from a playlist. Only the owner of the playlist or an administrator can perform this action. Throws an error if the song does not exist in the playlist.'

  #swagger.parameters['Authorization'] = {
    in: 'header',
    name: 'Authorization',
    required: true,
    type: 'string',
    description: 'Bearer JWT token to authenticate the user'
  }

  #swagger.parameters['idsong'] = {
    in: 'path',
    name: 'idsong',
    required: true,
    type: 'integer',
    description: 'Numeric ID of the song to be removed from the playlist'
  }

  #swagger.parameters['idPlaylist'] = {
    in: 'path',
    name: 'idPlaylist',
    required: true,
    type: 'string',
    description: 'MongoDB ObjectId of the playlist from which the song will be removed'
  }

  #swagger.responses[204] = {
    description: 'Song successfully removed from playlist (no content)'
  }

  #swagger.responses[400] = {
    description: 'Invalid input or bad request',
    schema: { error: 'Invalid ID format or request' }
  }

  #swagger.responses[401] = {
    description: 'Missing or invalid authorization token',
    schema: { message: 'No token provided' }
  }

  #swagger.responses[403] = {
    description: 'User is not authorized to modify the playlist',
    schema: { error: 'Access denied' }
  }

  #swagger.responses[404] = {
    description: 'Playlist not found',
    schema: { error: 'Playlist not found' }
  }

  #swagger.responses[409] = {
    description: 'Song is not in the playlist',
    schema: { error: 'Song 1 is not in the playlist' }
  }

  #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { error: 'Internal error trying to remove song from playlist' }
  }
  */
  `${PLAYLIST_BASIC_ROUTE}/:idsong/:idPlaylist/remove`,
  authorization,
  validatePlaylistOwnership,
  removeSongToPlaylistController
);

router.patch(
  /*
  #swagger.path = '/api/playlist/:idsong/:idPlaylist:/add'
  #swagger.tags = ['Playlists']
  #swagger.summary = 'Add a song to a playlist'
  #swagger.description = 'Adds a song (by its ID) to a playlist (by its ID). Only the playlist owner or an admin is authorized to perform this action. Duplicate songs are not allowed.'

  #swagger.parameters['Authorization'] = {
    in: 'header',
    name: 'Authorization',
    required: true,
    type: 'string',
    description: 'Bearer JWT token to authenticate the user'
  }

  #swagger.parameters['idsong'] = {
    in: 'path',
    name: 'idsong',
    required: true,
    type: 'integer',
    description: 'Numeric ID of the song to be added to the playlist'
  }

  #swagger.parameters['idPlaylist'] = {
    in: 'path',
    name: 'idPlaylist',
    required: true,
    type: 'string',
    description: 'MongoDB ObjectId of the playlist to which the song will be added'
  }
  #swagger.responses[204] = {
    description: 'Song successfully added to playlist (no content)'
  }

  #swagger.responses[400] = {
    description: 'Invalid ID format or other bad request error',
    schema: { error: 'Invalid song or playlist ID format' }
  }

  #swagger.responses[401] = {
    description: 'Missing or invalid authorization token',
    schema: { message: 'No token provided' }
  }

  #swagger.responses[403] = {
    description: 'User does not own the playlist or is not authorized',
    schema: { error: 'Access denied' }
  }

  #swagger.responses[404] = {
    description: 'Playlist or song not found',
    schema: { error: 'Playlist not found' }
  }

  #swagger.responses[409] = {
    description: 'The song is already in the playlist',
    schema: { error: 'Song 1 is already in the playlist' }
  }

  #swagger.responses[500] = {
    description: 'Internal server error',
    schema: { error: 'Internal error trying to add song to playlist' }
  }
*/
  `${PLAYLIST_BASIC_ROUTE}/:idsong/:idPlaylist/add`,
  authorization,
  validatePlaylistOwnership,
  validateIdSong,
  addSongToPlaylistController
);

router.delete(
  /*
    #swagger.path = '/api/playlist/:idPlaylist/delete'
    #swagger.tags = ['Playlists']
    #swagger.summary = 'Eliminar una playlist'
    #swagger.description = 'Elimina una playlist del sistema. Solo puede hacerlo el propietario o un administrador. También elimina la imagen asociada del sistema de archivos.'

    #swagger.parameters['Authorization'] = {
      in: 'header',
      name: 'Authorization',
      required: true,
      type: 'string',
      description: 'Bearer token JWT para autenticar al usuario'
    }

    #swagger.parameters['idPlaylist'] = {
      in: 'path',
      name: 'idPlaylist',
      required: true,
      type: 'string',
      description: 'ID de la playlist a eliminar'
    }

    #swagger.responses[204] = {
      description: 'Playlist eliminada correctamente'
    }

    #swagger.responses[401] = {
      description: 'Token no proporcionado o inválido',
      schema: {
        message: 'No token provided'
      }
    }

    #swagger.responses[403] = {
      description: 'El usuario no tiene permisos para eliminar esta playlist',
      schema: {
        message: 'Access denied'
      }
    }

    #swagger.responses[404] = {
      description: 'La playlist no existe o ya fue eliminada',
      schema: {
        error: 'Playlist not found or already deleted'
      }
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor',
      schema: {
        error: 'Error trying to delete the playlist. CALL NAVI'
      }
    }
  */
  `${PLAYLIST_BASIC_ROUTE}/:idPlaylist/delete`,
  authorization,
  validatePlaylistOwnership,
  deletePlaylistController
);

router.put(
  /*
    #swagger.path = '/api/playlist/upload'
    #swagger.tags = ['Playlists']
    #swagger.summary = 'Crear una nueva playlist con imagen'
    #swagger.description = 'Permite a un usuario autenticado subir una nueva playlist con su imagen asociada. La imagen debe ser PNG o JPG. El nombre de la playlist es obligatorio. Se guarda en el servidor y se registra en la base de datos.'

    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['Authorization'] = {
      in: 'header',
      name: 'Authorization',
      required: true,
      type: 'string',
      description: 'Bearer token JWT para autenticar al usuario'
    }

    #swagger.parameters['image'] = {
      in: 'formData',
      name: 'image',
      type: 'file',
      required: true,
      description: 'Imagen PNG o JPG de la playlist (máx. 20MB)'
    }

    #swagger.parameters['playlistName'] = {
      in: 'formData',
      name: 'playlistName',
      type: 'string',
      required: true,
      description: 'Nombre de la playlist'
    }

    #swagger.parameters['description'] = {
      in: 'formData',
      name: 'description',
      type: 'string',
      required: false,
      description: 'Descripción opcional de la playlist'
    }

    #swagger.responses[201] = {
      description: 'Playlist creada correctamente',
      schema: {
        message: "Playlist created successfully",
        playlist: {
          _id: "68267d8ec27bdad6076766f8",
          creator_id: 3,
          playlist_name: "pruebas",
          description: "adaddadada",
          image_path: "6f975260-38b9-4acf-a072-c6c49377d742.png",
          songs: [],
          createdAt: "2025-05-15T23:49:34.319Z",
          __v: 0
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Falta algún campo obligatorio o archivo inválido',
      schema: {
        error: "File not provided"
      }
    }

    #swagger.responses[401] = {
      description: 'Token no proporcionado',
      schema: {
        message: "No token provided"
      }
    }

    #swagger.responses[403] = {
      description: 'Token inválido o expirado',
      schema: {
        message: "Invalid or expired token"
      }
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor',
      schema: {
        error: "Failed to process image upload"
      }
    }
  */
  `${PLAYLIST_BASIC_ROUTE}/upload`,
  authorization,
  upload.single("image"),
  validateFileType,
  validateNewPlaylist,
  uploadPlaylistImageController
);

router.put(
  /*
    #swagger.path = '/api/playlist/base64/upload'
    #swagger.tags = ['Playlists']
    #swagger.summary = 'Crear una nueva playlist con imagen en formato Base64'
    #swagger.description = 'Permite a un usuario autenticado crear una nueva playlist enviando la imagen codificada en Base64. La imagen debe estar en formato PNG o JPG y debe incluir el encabezado MIME. El nombre de la playlist es obligatorio. La imagen se guarda en el servidor y se registra en la base de datos.'

    #swagger.consumes = ['application/json']

    #swagger.parameters['Authorization'] = {
      in: 'header',
      name: 'Authorization',
      required: true,
      type: 'string',
      description: 'Bearer token JWT para autenticar al usuario'
    }

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $playlistName: "Nombre de la playlist",
        description: "Descripción opcional",
        $imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
      }
    }

    #swagger.responses[201] = {
      description: 'Playlist creada correctamente con imagen en base64',
      schema: {
        message: "Playlist created successfully",
        playlist: {
          _id: "68267d8ec27bdad6076766f8",
          creator_id: 3,
          playlist_name: "Nombre de prueba",
          description: "Descripción",
          image_path: "2025-05-22-uuid.jpeg",
          songs: [],
          createdAt: "2025-05-22T17:30:00.000Z",
          __v: 0
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Falta algún campo obligatorio o imagen Base64 inválida',
      schema: {
        error: "Invalid image base64 format"
      }
    }

    #swagger.responses[401] = {
      description: 'Token no proporcionado',
      schema: {
        message: "No token provided"
      }
    }

    #swagger.responses[403] = {
      description: 'Token inválido o expirado',
      schema: {
        message: "Invalid or expired token"
      }
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor al guardar la imagen',
      schema: {
        error: "Failed to save image from base64"
      }
    }
  */
  `${PLAYLIST_BASIC_ROUTE}/base64/upload`,
  authorization,
  validateNewPlaylistBase64,
  validateImageBase64Format,
  uploadPlaylistImageBase64Controller
);

module.exports = router;
