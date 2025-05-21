const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth.middleware");
const { loginUser } = require("../controllers/login.controller");
const {
  sendCode,
  compareCode,
}= require("../controllers/user.controller");
const {recoverUser} = require("../controllers/user.controller");
const {UpdateFCMTokenController} = require("../controllers/auth.controller");

const AUTH_BASIC_ROUTE = "/api/auth";

router.post(
    /*
  #swagger.path = '/api/auth/fcm/update'
  #swagger.tags = ['Auth']
  #swagger.description = 'Register or update a user\'s FCM token. Requires JWT authorization.'

  #swagger.security = [{
    "BearerAuth": []
  }]

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'FCM token data for the authenticated user',
    schema: {
      token: 'fcm_token_string',
      device: 'android',
      platform_version: '13',
      app_version: '1.2.3'
    }
  }

  #swagger.responses[204] = {
    description: 'FCM token registered or updated successfully (No Content)'
  }

  #swagger.responses[400] = {
    description: 'Missing required fields',
    schema: {
      message: 'Missing user_id or token'
    }
  }

  #swagger.responses[401] = {
    description: 'Unauthorized - Missing or invalid token',
    schema: {
      message: 'No token provided'
    }
  }

  #swagger.responses[500] = {
    description: 'Internal server error while processing FCM token',
    schema: {
      message: 'Failed to update FCM token'
    }
  }
  */
  `${AUTH_BASIC_ROUTE}/fcm/update`,
  authorization,
  UpdateFCMTokenController
);

router.get(
  /*
  #swagger.path = '/api/auth/validateJWT'
  #swagger.tags = ['Auth']
  #swagger.description = 'Validates a JWT and returns user information if the token is valid.'
  
  #swagger.responses[200] = {
    description: 'User data extracted from valid JWT.',
    schema: {
      idUser: 2,
      nameUser: '1',
      email: 'zs22013698@estudiantes.uv.mx',
      idRole: 1
    }
  }

  #swagger.responses[401] = {
    description: 'Unauthorized - Missing or invalid token',
    schema: {
      "message": "No token provided"
    }
  }
  #swagger.responses[403] = {
    description: 'Forbidden - Access to the resource is prohibited',
    schema: {
      "message": "Invalid or expired token"
    }
  }

  #swagger.responses[500] = {
    description: 'Internal Server Error',
    schema: {
      message: 'Unexpected error while validating token'
    }
  }
    */
  `${AUTH_BASIC_ROUTE}/validateJWT`,
  authorization,
  recoverUser
);

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
  `${AUTH_BASIC_ROUTE}/login`,
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
  `${AUTH_BASIC_ROUTE}/sendCodeEmail`,
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
  `${AUTH_BASIC_ROUTE}/validateJWT`,
  compareCode
);

module.exports = router;
