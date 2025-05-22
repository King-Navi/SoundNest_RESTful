class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class DeletedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DeletedError';
    this.statusCode = 410;
  }
}

class BadRequestError  extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error validating';
    this.statusCode = 400;
  }
}


module.exports = {
  NotFoundError,
  DeletedError,
  BadRequestError,
};
