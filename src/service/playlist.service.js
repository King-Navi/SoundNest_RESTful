const path = require("path");
const PlaylistRepository = require("../repositories/playlist.mongo.repository");
const FileManager = require("../utils/fileManager");
const { NonexistentPlaylist } = require("./exceptions/exceptions");
const fileManager = new FileManager("PLAYLIST_IMAGE_PATH_JS");
const playlistRepository = new PlaylistRepository();
const { getSongsByIds } = require("../repositories/song.repository");

/**
 * Cleans the song list of a playlist by removing songs
 * that do not exist or are marked as deleted in the SQL database.
 *
 * @param {string} playlistId – ID of the playlist in Mongo
 * @returns {Promise<number[]>} – Array of song_ids that were removed
 *
 * @throws {NonexistentPlaylist} If the playlist does not exist
 */
async function cleanPlaylistSongs(playlistId) {
  const playlist = await playlistRepository.getPlaylistById(playlistId);
  if (!playlist) {
    throw new NonexistentPlaylist(`Playlist with id ${playlistId} not found`);
  }
  const originalEntries = playlist.songs || [];
  const originalIds = originalEntries.map((e) => e.song_id);

  if (originalIds.length === 0) {
    return [];
  }
  const existingSongs = await getSongsByIds(originalIds);
  const existingIds = existingSongs.map((s) => s.idSong);
  const removedIds = originalIds.filter((id) => !existingIds.includes(id));
  const cleanedEntries = originalEntries.filter((e) =>
    existingIds.includes(e.song_id)
  );
  await playlistRepository.updatePlaylistById(playlistId, {
    songs: cleanedEntries,
  });
  return removedIds;
}

/**
 * Edits an existing playlist.
 *
 * @param {string} playlistId   - ID of the playlist to edit.
 * @param {number} userId       - ID of the user making the request.
 * @param {Object} payload      - Fields to update: { playlist_name, description, image_path }.
 * @returns {Object}            - The updated playlist.
 *
 * @throws {NonexistentPlaylist} If the playlist does not exist.
 * @throws {Error}               If the user is not the creator (access denied).
 */
async function editPlaylistService(playlistId, userId, payload) {
  const playlist = await playlistRepository.getPlaylistById(playlistId);
  if (!playlist) {
    throw new NonexistentPlaylist(
      `Playlist con id ${playlistId} no encontrada`
    );
  }
  if (playlist.creator_id !== userId) {
    throw new Error("Acceso denegado: no eres el propietario de esta playlist");
  }
  const updateData = {};
  if (payload.playlist_name !== undefined)
    updateData.playlist_name = payload.playlist_name;
  if (payload.description !== undefined)
    updateData.description = payload.description;
  const updated = await playlistRepository.updatePlaylistById(
    playlistId,
    updateData
  );
  if (!updated) {
    throw new NonexistentPlaylist(
      `No se pudo actualizar la playlist con id ${playlistId}`
    );
  }
  return updated;
}

async function getPlaylistService(iduser) {
  const playlists = await playlistRepository.getPlaylistsByCreatorId(iduser);
  if (!playlists) {
    throw new NonexistentPlaylist("Playlist not found or already deleted");
  }
  return playlists;
}

async function removeSongToPlaylistService(idPlaylist, idsong) {
  const removed = await playlistRepository.removeSongFromPlaylist(
    idPlaylist,
    idsong
  );
  if (!removed) {
    throw new NonexistentPlaylist("Playlist not found or already deleted");
  }
}
async function addSongToPlaylistService(idPlaylist, idsong) {
  const added = await playlistRepository.addSongToPlaylist(idPlaylist, idsong);
  if (!added) {
    throw new NonexistentPlaylist("Playlist not found or already deleted");
  }
}

async function deletePlaylistService(idPlaylistS) {
  const deleted = await playlistRepository.deletePlaylistById(idPlaylistS);
  if (!deleted) {
    throw new NonexistentPlaylist("Playlist not found or already deleted");
  }
  const imageFileName = deleted.image_path;
  if (imageFileName) {
    const name = path.parse(imageFileName).name;
    const extension = path.extname(imageFileName).replace(".", "");

    try {
      await fileManager.deleteImage(name, extension);
    } catch (error) {
      console.warn(
        `[deletePlaylistService] Could not delete image for playlist ${idPlaylistS}:`,
        error.message
      );
    }
  }
}

async function createPlaylistService({
  userId,
  playlistName,
  description,
  fileName,
  tempPath,
}) {
  await fileManager.moveTempImage(tempPath, fileName);
  const playlist = await playlistRepository.createPlaylist({
    creator_id: userId,
    playlist_name: playlistName,
    description,
    image_path: fileName,
    songs: [],
  });

  return playlist;
}

const getImageUrl = (protocol, host, filename) => {
  if (!filename) {
    throw new Error("Filename is required to generate URL");
  }

  return `${protocol}://${host}/images/playlists/${filename}`;
};

module.exports = {
  deletePlaylistService,
  createPlaylistService,
  getImageUrl,
  addSongToPlaylistService,
  removeSongToPlaylistService,
  getPlaylistService,
  editPlaylistService,
  cleanPlaylistSongs,
  fileManager,
};
