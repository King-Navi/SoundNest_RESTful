class EmailAlreadySend extends Error {
  constructor(message = "Wait for new code") {
    super(message);
    this.name = "EmailAlreadySend";
    this.statusCode = 400;
  }
}

class NonexistentSong extends Error {
  constructor(message = "The song does not exist") {
    super(message);
    this.name = "Not exist";
    this.statusCode = 404;
  }
}

class NonexistentPlaylist extends Error {
  constructor(message = "The Playlist does not exist") {
    super(message);
    this.name = "Not exist";
    this.statusCode = 404;
  }
}

class SongAlreadyInPlaylist extends Error {
  constructor(message = "already in the playlist") {
    super(message);
    this.name = "Conflict";
    this.statusCode = 409;
  }
}

class SongNotInPlaylist extends Error {
  constructor(message = "not in the playlist") {
    super(message);
    this.name = "Not in playlist";
    this.statusCode = 400;
  }
}
class NonexistentVisualization extends Error {
  constructor(message = "not in the playlist") {
    super(message);
    this.name = "Not in playlist";
    this.statusCode = 400;
  }
}

module.exports = {
  EmailAlreadySend,
  NonexistentSong,
  NonexistentPlaylist,
  SongAlreadyInPlaylist,
  SongNotInPlaylist,
  NonexistentVisualization,
};
