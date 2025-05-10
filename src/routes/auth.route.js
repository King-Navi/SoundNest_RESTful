const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/login.controller");
const {
  sendCode,
  compareCode,
}= require("../controllers/user.controller");

router.post(
  /* 
  #swagger.path = '/api/auth/login'
  #swagger.tags = ['Auth']
  #swagger.description = 'Endpoint para login de usuario'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: 'user@example.com',
      password: '123456'
    }
  }
*/
  "/login",
  loginUser
);

router.post(
  /* 
  #swagger.path = '/api/auth/sendCodeEmail'
  #swagger.tags = ['Auth']
  #swagger.description = 'Sends a confirmation code to the user\'s email.'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: 'user@example.com'
    }
  }
  #swagger.responses[200] = {
    description: 'Code sent successfully'
  }
  #swagger.responses[400] = {
    description: 'Failed to send code'
  }
*/
  "/sendCodeEmail",
  sendCode
);

router.post(
  /* 
  #swagger.path = '/api/auth/verifiCode'
  #swagger.tags = ['Auth']
  #swagger.description = 'Verifies the confirmation code sent to the user\'s email. Delete the code after'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      email: 'user@example.com',
      code: 123456
    }
  }
  #swagger.responses[200] = {
    description: 'Code verified successfully'
  }
  #swagger.responses[400] = {
    description: 'Invalid or expired code'
  }
*/
  "/verifiCode",
  compareCode
);

module.exports = router;
