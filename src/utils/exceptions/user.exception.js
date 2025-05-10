const HttpError = require("./httpError");

class EmailAlreadyExist extends HttpError {
  constructor() {
    super(400, "Email already exists");
  }
}

class UserNameAlreadyExist extends HttpError {
  constructor() {
    super(400, "User name already exists");
  }
}

module.exports = {
  EmailAlreadyExist,
  UserNameAlreadyExist
};
