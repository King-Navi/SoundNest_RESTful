require('dotenv').config();

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
  getImageUrl,
  getPlaylistByIdPlaylist,
  getPlaylistsByIdUser
};
