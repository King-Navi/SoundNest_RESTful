const fs = require("fs/promises");
const { NotFoundError } = require("../repositories/exceptions/song.exceptions");
const {
  getGenres,
  getExtensions,
  getSong,
  getRandom,
  getRecent,
  getMostPopular,
  searchSong,
  getSongOfUser,
  getLastUserSong,
  deleteSongService,
} = require("../service/song.service");
const { updateSongImage } = require("../service/songImage.service");

async function deleteSongController(req, res) {
  try {
    const idSong = Number(req.params.idsong);
    const result = await deleteSongService(idSong);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[deleteSongController]', err);
    if (err.message.includes('does not exist')) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
}


async function updateImageSongController(req, res) {
  try {
    const songId = Number(req.params.idsong);
    const fileName = req._uploadedFileName;
    const tmpDir = req._tmpDirPath;

    try {
      await updateSongImage(songId, fileName, tmpDir);
      return res.status(204).end();
    } catch (error) {
      console.error("[updateImageSongController]", error);
      if (tmpDir) {
        await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
      }
      return res
        .status(500)
        .json({ error: "Error al actualizar imagen: " + error.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch : " + error.message });
  }
}

async function searchSongController(req, res) {
  try {
    const { songName, artistName, idGenre, limit, offset } = req.query;
    const result = await searchSong(
      songName,
      artistName,
      idGenre,
      limit,
      offset
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch : " + error.message });
  }
}
async function getMostPopularSongsController(req, res) {
  try {
    const { year, month, amount } = req.params;
    const yearNum = Number(year);
    const monthNum = Number(month);
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid or missing amountNumericAmount" });
    }
    if (isNaN(yearNum) || yearNum < 1) {
      return res
        .status(400)
        .json({ error: "Invalid or missing yearNumericAmount" });
    }
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res
        .status(400)
        .json({ error: "Invalid or missing monthNumericAmount" });
    }
    const result = await getMostPopular(yearNum, monthNum, amountNum);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch : " + error.message });
  }
}

async function getSongRecentController(req, res) {
  try {
    const { amount } = req.params;
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount)) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }
    const result = await getRecent(amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch : " + error.message });
  }
}
async function getSongRandomController(req, res) {
  try {
    const { amount } = req.params;

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    const result = await getRandom(amount);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: "Songs not found" });
    }
    res.status(500).json({ error: "Failed to fetch : " + error.message });
  }
}

async function getSongController(req, res) {
  try {
    const { idsong } = req.params;

    const songId = Number(idsong);
    if (!idsong || isNaN(songId) || songId <= 0) {
      return res.status(400).json({ error: "Invalid or missing song ID" });
    }
    const result = await getSong(Number(idsong));
    if (!result) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.status(500).json({ error: "Failed to fetch : " + error.message });
  }
}
/**
 * Express handler to return all song genres as JSON.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getGenresController(req, res) {
  try {
    const genres = await getGenres();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres." });
  }
}
/**
 * Express handler to return all file extensions as JSON.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getExtensionsController(req, res) {
  try {
    const extensions = await getExtensions();
    res.status(200).json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch extensions." });
  }
}
async function getSongOfUserController(req, res) {
  try {
    const { idAppUser } = req.params;
    const extensions = await getSongOfUser(idAppUser);
    res.status(200).json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs." + error.message });
  }
}

async function getLastUserSongController(req, res) {
  try {
    const { idAppUser } = req.params;
    const extensions = await getLastUserSong(idAppUser);
    res.status(200).json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs." + error.message });
  }
}

module.exports = {
  getSongController,
  getGenresController,
  getExtensionsController,
  getSongRandomController,
  getSongRecentController,
  getMostPopularSongsController,
  searchSongController,
  getSongOfUserController,
  getLastUserSongController,
  updateImageSongController,
  deleteSongController
};
