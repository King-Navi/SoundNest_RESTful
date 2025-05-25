class NoChangesError extends Error {
  constructor(message = "No changes in MySQL") {
    super(message);
    this.name = "NoChangesError";
    this.statusCode = 400;
  }
}

module.exports = NoChangesError;
