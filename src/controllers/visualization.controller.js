const visualizationService = require("../service/visualization.service");
const songService = require("../service/song.service");
const {checkAndNotifySongVisits} = require("../service/messaging.service");
const { NonexistentVisualization } = require("../service/exceptions/exceptions");


async function incrementPlayCount(req, res) {
  const { idSong } = req.song;
  try {
    await visualizationService.increasePlayCountForSong(Number(idSong));
    await checkAndNotifySongVisits(req.song);
    res.status(204).send();
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
}


async function getVisualizationByPeriod(req, res) {
  const {idSong} = req.song;
  const { year, month } = req.params;
  try {
    const result = await visualizationService.getVisualizationBySongAndPeriod(
      Number(idSong),
      Number(month),
      Number(year)
    );
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NonexistentVisualization) {
      res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}


async function listVisualizationsBySong(req, res) {
  const { idSong } = req.song;
  try {
    const results = await visualizationService.getVisualizationsForSong(Number(idSong));
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function getTopSongsVisits(req, res) {
  const { year, month } = req.params;
  const { limit } = req.query;
  try {
      

    if (
      !Number.isInteger(Number(month)) ||
      !Number.isInteger(Number(year))
    ) {
      return res.status(400).json({ error: "Invalid month or year" });
    }
    const result = await visualizationService.getTopSongsByPeriod(
      Number(year),
      Number(month),
      limit ? Number(limit) : 10
    );
    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  incrementPlayCount,
  getVisualizationByPeriod,
  listVisualizationsBySong,
  getTopSongsVisits,
};