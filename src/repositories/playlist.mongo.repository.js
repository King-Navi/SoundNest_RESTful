const { Playlist } = require('../modelsMongo/playlist');
const {NonexistentPlaylist, SongAlreadyInPlaylist, SongNotInPlaylist} = require('../service/exceptions/exceptions');

class PlaylistRepository {
  async createPlaylist(data) {
    try {
      const playlist = new Playlist(data);
      return await playlist.save();
    } catch (error) {
      throw new Error('Could not create playlist');
    }
  }

  async getPlaylistById(id) {
    try {
      return await Playlist.findById(id);
    } catch (error) {
      throw new Error('Could not retrieve playlist');
    }
  }

  async getAllPlaylists(filter = {}) {
    try {
      return await Playlist.find(filter);
    } catch (error) {
      throw new Error('Could not retrieve playlists');
    }
  }

  async updatePlaylistById(id, updateData) {
    try {
      return await Playlist.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error('Could not update playlist');
    }
  }

  async deletePlaylistById(id) {
    try {
      return await Playlist.findByIdAndDelete(id);
    } catch (error) {
      console.log(error)
      throw new Error('Could not delete playlist');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        throw new NonexistentPlaylist('Playlist not found');
      }

      const alreadyExists = playlist.songs.some(s => s.song_id === Number(songId));

      if (alreadyExists) {
        throw new SongAlreadyInPlaylist(`Song ${songId} is already in the playlist`);
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
      throw new NonexistentPlaylist('Playlist not found');
    }

    const initialLength = playlist.songs.length;

    playlist.songs = playlist.songs.filter(song => song.song_id !== Number(songId));

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
    return await Playlist.find({ creator_id: creatorId });
  } catch (error) {
    throw new Error('Could not retrieve playlists by creator_id');
  }
}
}

module.exports = PlaylistRepository;
