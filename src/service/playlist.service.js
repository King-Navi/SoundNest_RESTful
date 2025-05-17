require('dotenv').config();
const path = require('path');
const PlaylistRepository = require('../repositories/playlist.mongo.repository');
const FileManager = require('../utils/fileManager');
const {NonexistentPlaylist} = require('./exceptions/exceptions');
const fileManager = new FileManager('PLAYLIST_IMAGE_PATH_JS');
const playlistRepository = new PlaylistRepository()

async function getPlaylistService(iduser) {
  const playlists = await playlistRepository.getPlaylistsByCreatorId(iduser);
  if (!playlists) {
    throw new NonexistentPlaylist('Playlist not found or already deleted');
  }
  return playlists;
}

async function removeSongToPlaylistService(idPlaylist, idsong) {
  const removed = await playlistRepository.removeSongFromPlaylist(idPlaylist, idsong);
  if (!removed) {
    throw new NonexistentPlaylist('Playlist not found or already deleted');
  }
  
}
async function addSongToPlaylistService(idPlaylist, idsong) {
  const added = await playlistRepository.addSongToPlaylist(idPlaylist, idsong);
  if (!added) {
    throw new NonexistentPlaylist('Playlist not found or already deleted');
  }
}


async function deletePlaylistService(idPlaylistS) {
  const deleted = await playlistRepository.deletePlaylistById(idPlaylistS);
  if (!deleted) {
    throw new NonexistentPlaylist('Playlist not found or already deleted');
  }
  const imageFileName = deleted.image_path;
  if (imageFileName) {
    const name = path.parse(imageFileName).name;
    const extension = path.extname(imageFileName).replace('.', '');

    try {
      await fileManager.deleteImage(name, extension);
    } catch (error) {
      console.warn(`[deletePlaylistService] Could not delete image for playlist ${idPlaylistS}:`, error.message);
    }
  }
}


async function createPlaylistService({ userId, playlistName, description, fileName, tempPath }) {
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
    throw new Error('Filename is required to generate URL');
  }

  return `${protocol}://${host}/images/playlists/${filename}`;
};

const getPlaylistByIdPlaylist = (idPlaylist)=>{

}

const getPlaylistsByIdUser = (idPlaylist)=>{

}

module.exports = {
  deletePlaylistService,
  createPlaylistService,
  getImageUrl,
  getPlaylistByIdPlaylist,
  getPlaylistsByIdUser,
  addSongToPlaylistService,
  removeSongToPlaylistService,
  getPlaylistService
};
