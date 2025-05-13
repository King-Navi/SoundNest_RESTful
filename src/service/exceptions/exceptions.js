class EmailAlreadySend extends Error {
    constructor(message = 'Wait for new code') {
      super(message);
      this.name = 'EmailAlreadySend';
      this.statusCode = 400;
    }
  }

class NonexistentSong extends Error {
    constructor(message = 'The song does not exist') {
      super(message);
      this.name = 'Not exist';
      this.statusCode = 404;
    }
  }
  
  module.exports = {
    EmailAlreadySend,
    NonexistentSong
  };