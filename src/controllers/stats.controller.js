const { getUserSongStats } = require("../service/stats.service");

async function userStatsController(req, res) {
  try {
    const userId = parseInt(req.params.idUser, 10);
    const stats = await getUserSongStats(userId);

    return res.json(stats);
  } catch (err) {
    console.error("[userStatsController] Error fetching stats:", err);
    res.status(500).json({ error: "Could not retrieve user statistics." });
  }
}

module.exports = {
  userStatsController,
};
