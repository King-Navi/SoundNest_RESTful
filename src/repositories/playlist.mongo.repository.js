const { Playlist } = require("../modelsMongo/playlist");
const {
  NonexistentPlaylist,
  SongAlreadyInPlaylist,
  SongNotInPlaylist,
} = require("../service/exceptions/exceptions");

class PlaylistRepository {
  async createPlaylist(data) {
    try {
      const playlist = new Playlist(data);
      const saved = await playlist.save();
      return formatPlaylistImagePath(saved);
    } catch (error) {
      throw new Error("Could not create playlist");
    }
  }

  async getPlaylistById(id) {
    try {
      const playlist = await Playlist.findById(id);
      return formatPlaylistImagePath(playlist);
    } catch (error) {
      throw new Error("Could not retrieve playlist");
    }
  }

  async getAllPlaylists(filter = {}) {
    try {
      const playlists = await Playlist.find(filter);
      return formatManyPlaylists(playlists);
    } catch (error) {
      throw new Error("Could not retrieve playlists");
    }
  }

  async updatePlaylistById(id, updateData) {
    try {
      return await Playlist.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error("Could not update playlist");
    }
  }

  async deletePlaylistById(id) {
    try {
      return await Playlist.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      throw new Error("Could not delete playlist");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        throw new NonexistentPlaylist("Playlist not found");
      }

      const alreadyExists = playlist.songs.some(
        (s) => s.song_id === Number(songId)
      );

      if (alreadyExists) {
        throw new SongAlreadyInPlaylist(
          `Song ${songId} is already in the playlist`
        );
      }

      playlist.songs.push({
        song_id: songId,
        addedAt: new Date(),
      });

      return await playlist.save();
    } catch (error) {
      throw error;
    }
  }

  async removeSongFromPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        throw new NonexistentPlaylist("Playlist not found");
      }

      const initialLength = playlist.songs.length;

      playlist.songs = playlist.songs.filter(
        (song) => song.song_id !== Number(songId)
      );

      if (playlist.songs.length === initialLength) {
        throw new SongNotInPlaylist(`Song ${songId} is not in the playlist`);
      }

      return await playlist.save();
    } catch (error) {
      throw error;
    }
  }
  async getPlaylistsByCreatorId(creatorId) {
    try {
      const playlists = await Playlist.find({ creator_id: creatorId });
      return formatManyPlaylists(playlists);
    } catch (error) {
      throw new Error("Could not retrieve playlists by creator_id");
    }
  }
}
/**
 * Formats the `image_path` of a playlist by prepending the public image directory path.
 *
 * Converts the Mongoose document to a plain object if necessary,
 * and modifies the `image_path` field to include the `/images/playlists/` prefix,
 * so it can be served as a static file.
 *
 * @param {Object|Document|null} playlist - A playlist document or plain object.
 * @returns {Object|null} The formatted playlist object, or `null` if input is null.
 *
 * @example
 * const formatted = formatPlaylistImagePath(playlist);
 * console.log(formatted.image_path); // → "/images/playlists/my_cover.jpg"
 */
function formatPlaylistImagePath(playlist) {
  if (!playlist) return null;

  const formatted = playlist.toObject ? playlist.toObject() : { ...playlist };
  if (formatted.image_path) {
    formatted.image_path = `/images/playlists/${formatted.image_path}`;
  }

  return formatted;
}

function formatManyPlaylists(playlists) {
  return playlists.map(formatPlaylistImagePath);
}

module.exports = PlaylistRepository;
