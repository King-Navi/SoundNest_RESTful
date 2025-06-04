const express = require("express");
const router = express.Router();
const visualizationController = require("../controllers/visualization.controller");
const validateSongId = require("../middlewares/validateSongId.middleware");
const {
  validateUserIdParam,
} = require("../middlewares/validateIdUser.middleware");
const { userStatsController } = require("../controllers/stats.controller");

const VISUALIZATION_BASIC_ROUTE = "/api/visit";

router.get(
  /**
  #swagger.tags = ['Visualizations']
  #swagger.path = '/api/visit/users/:idUser/stats'
  #swagger.summary = 'Get total plays and top song for a user'
  #swagger.description = 'Returns the total number of plays of all songs of a user, the name of the most played song, and its play count.'
  #swagger.parameters['idUser'] = {
    in: 'path',
    description: 'ID of the user',
    required: true,
    schema: { type: 'integer' }
  }
  #swagger.responses[200] = {
    description: 'User statistics retrieved successfully',
    schema: {
      totalPlays: 100,
      topSongName: 'Song Title',
      playCount: 50
    }
  }
  #swagger.responses[400] = {
    description: 'Invalid user ID',
    schema: { error: 'Invalid user ID' }
  }
  #swagger.responses[404] = {
    description: 'User not found or no songs',
    schema: { error: 'No statistics found for user ...' }
  }
  #swagger.responses[500] = {
    description: 'Server error',
    schema: { error: 'Error message' }
  }
*/
  `${VISUALIZATION_BASIC_ROUTE}/users/:idUser/stats`,
  validateUserIdParam,
  userStatsController
);

router.post(
  /*
  #swagger.tags = ['Visualizations']
    #swagger.path = '/api/visit/:idsong/increment'
    #swagger.summary = 'Increment or create monthly play count'
    #swagger.description = 'Increments the play count for the current month. If no record exists for that month, creates it with playCount=1.'
    #swagger.parameters['idsong'] = {
      in: 'path',
      description: 'ID of the song to increment',
      required: true,
      schema: { type: 'integer' }
    }
  */
  `${VISUALIZATION_BASIC_ROUTE}/:idsong/increment`,
  validateSongId,
  visualizationController.incrementPlayCount
);

router.get(
  /*
  #swagger.tags = ['Visualizations']
    #swagger.path = '/api/visit/topVisualization/:year/:month'
    #swagger.summary = 'Get top song IDs by plays in a month'
    #swagger.description = 'Returns an array of song IDs ordered by descending play count for the given month/year.'
    #swagger.parameters['year'] = {
      in: 'path',
      description: 'Four-digit year (e.g. 2025)',
      required: true,
      schema: { type: 'integer' }
    }
    #swagger.parameters['month'] = {
      in: 'path',
      description: 'Month number (1–12)',
      required: true,
      schema: { type: 'integer' }
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      name: 'limit',
      description: 'Max number of song IDs to return (default: 10)',
      required: false,
      schema: { type: 'integer', default: 10, minimum: 1, maximum: 60 }
    }
      */
  `${VISUALIZATION_BASIC_ROUTE}/topVisualization/:year/:month`,
  visualizationController.getTopSongsVisits
);

router.get(
  /*
  #swagger.tags = ['Visualizations']
    #swagger.path = '/api/visit/song/:idsong/:year/:month'
    #swagger.summary = 'Get visualization record for a song in a month'
    #swagger.description = 'Returns the visualization object for a given song ID and month/year.'
    #swagger.parameters['idsong'] = {
      in: 'path',
      description: 'ID of the song',
      required: true,
      schema: { type: 'integer' }
    }
    #swagger.parameters['year'] = {
      in: 'path',
      description: 'Four-digit year',
      required: true,
      schema: { type: 'integer' }
    }
    #swagger.parameters['month'] = {
      in: 'path',
      description: 'Month number (1–12)',
      required: true,
      schema: { type: 'integer' }
    }
    #swagger.responses[200] = {
      description: 'Visualization record found',
      schema: {
        idVisualizations: 1,
        playCount: 10,
        period: '2025-05-01',
        idSong: 42
      }
    }
    #swagger.responses[404] = {
      description: 'No record found',
      schema: { error: 'No visualization found for song ...' }
    }
    #swagger.responses[400] = {
      description: 'Invalid parameters',
      schema: { error: 'Missing or invalid parameters' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { error: 'Error message' }
    }
  */
  `${VISUALIZATION_BASIC_ROUTE}/song/:idsong/:year/:month`,
  validateSongId,
  visualizationController.getVisualizationByPeriod
);

router.get(
  /*
  
  #swagger.tags = ['Visualizations']
    #swagger.path = '/api/visit/song/:idsong'
    #swagger.summary = 'List all visualizations for a song'
    #swagger.description = 'Returns an array of all visualization records for the specified song, ordered by period.'
    #swagger.parameters['idsong'] = {
      in: 'path',
      description: 'ID of the song',
      required: true,
      schema: { type: 'integer' }
    }
    #swagger.responses[200] = {
      description: 'Array of visualization objects',
      schema: {
        type: 'array',
        items: {
          idVisualizations: 1,
          playCount: 15,
          period: '2025-05-12',
          idSong: 42
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid song ID',
      schema: { error: 'Invalid or missing song ID' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { error: 'Error message' }
    }
  */
  `${VISUALIZATION_BASIC_ROUTE}/song/:idsong(\\d+)`,
  validateSongId,
  visualizationController.listVisualizationsBySong
);

router.get(
    /*
    #swagger.path = '/api/visit/user/:idUser/top-songs'
    #swagger.tags = ['Visualizations']
    #swagger.summary = 'Get top N songs for a user'
    #swagger.description = 'Returns an array of the user’s top N most listened songs, ordered by play count.'

    #swagger.parameters['idUser'] = {
      in: 'path',
      description: 'ID of the user',
      required: true,
      type: 'integer'
    }

    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of songs to return (default: 10)',
      required: false,
      type: 'integer',
      default: 10
    }

    #swagger.responses[200] = {
      description: 'Top songs retrieved successfully',
      schema: [
        { songName: 'Song Title A', totalPlayCount: 125 },
        { songName: 'Song Title B', totalPlayCount: 90 }
      ]
    }
  */
  `${VISUALIZATION_BASIC_ROUTE}/user/:idUser/top-songs`,
  validateUserIdParam,
  visualizationController.getTopSongsByUserController
);
router.get(
  /*
    #swagger.path = '/api/visit/global/top-songs'
    #swagger.tags = ['Visualizations']
    #swagger.summary = 'Get top N songs globally'
    #swagger.description = 'Returns an array of the globally most listened songs, ordered by total play count.'

    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of songs to return (default: 10)',
      required: false,
      type: 'integer',
      default: 10
    }

    #swagger.responses[200] = {
      description: 'Top global songs retrieved successfully',
      schema: [
        { songName: 'Global Hit 1', totalPlayCount: 2000 },
        { songName: 'Global Hit 2', totalPlayCount: 1800 }
      ]
    }
  */
  `${VISUALIZATION_BASIC_ROUTE}/global/top-songs`,
  visualizationController.getTopGlobalSongsController
);
router.get(
  /*
    #swagger.path = '/api/visit/global/top-genres'
    #swagger.tags = ['Visualizations']
    #swagger.summary = 'Get top N genres globally'
    #swagger.description = 'Returns an array of the most popular genres globally, ordered by total play count.'

    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of genres to return (default: 10)',
      required: false,
      type: 'integer',
      default: 10
    }

    #swagger.responses[200] = {
      description: 'Top genres retrieved successfully',
      schema: [
        { genreName: 'Pop', totalPlayCount: 3500 },
        { genreName: 'Rock', totalPlayCount: 2800 }
      ]
    }
  */
  `${VISUALIZATION_BASIC_ROUTE}/global/top-genres`,
  visualizationController.getTopGlobalGenresController
);

module.exports = router;
