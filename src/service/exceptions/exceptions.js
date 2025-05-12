class EmailAlreadySend extends Error {
    constructor(message = 'Wait for new code') {
      super(message);
      this.name = 'EmailAlreadySend';
      this.statusCode = 400;
    }
  }
  
  module.exports = {
    EmailAlreadySend
  };