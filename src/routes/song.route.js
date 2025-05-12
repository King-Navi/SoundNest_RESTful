const express = require("express");
const { getGenresController, getExtensionsController } = require("../controllers/song.controller");
const router = express.Router();
/*
TODO:

GET RANDOM ID_SONGS
GET INFO_SONG  |⚠️ FALTA PODER RECUPERAR VISUALIZACIONES Y DESCRIPCION
GET MOST RECENT SONGS_
GET MOST POPULAR SONGS BY MONTH |⚠️ FALTA PODER RECUPERAR VISUALIZACIONES
GET SEARCH SONGS  1.- O nombre del autos 2.- O Genreo

DELETE SONG
*/
const SONG_BASIC_ROUTE = "/api/songs"


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
