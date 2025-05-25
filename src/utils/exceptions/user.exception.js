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
class NonexistentAditionalInformation extends HttpError {
  constructor() {
    super(404, "The AditionalInformation does not exist");
  }
}

module.exports = {
  EmailAlreadyExist,
  UserNameAlreadyExist,
  NonexistentAditionalInformation,
};
