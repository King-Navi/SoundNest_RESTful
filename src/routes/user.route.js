const express = require("express");
const router = express.Router();
const {registerUser, editUser, editUserPasswordController} = require("../controllers/user.controller");
const compareCodeMiddleware = require("../middlewares/compareCode.middleware");
const authorization = require("../middlewares/auth.middleware");
const { validateEditUser , validateNewUser, validateEditUserPassword} = require("../middlewares/validateEditUser.middleware");


const USER_BASIC_ROUTE="/api/user";

router.post(
  /* 
  #swagger.path = '/api/user/newUser'
  #swagger.tags = ['Users']
  #swagger.description = 'Creates a new user. Deletes the code sent to the email after validation.'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      nameUser: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', example: 'juan@example.com' },
      password: { type: 'string', example: 'contraseña256' },
      code: { type: 'string', example: 'a1B2c3' },
      additionalInformation: {
        type: 'object',
        required: false,
        properties: {
          bio: { type: 'string', example: 'I love electronic music' },
          instagram: { type: 'string', example: '@juan_music' },
          genres: { type: 'array', items: { type: 'string' }, example: ['rock', 'electronic'] },
          additionalProperties: true
        }
      }
    }
  }
  #swagger.responses[204] = { description: 'User created successfully (no content)' }
  #swagger.responses[400] = { description: 'Invalid or missing data' }
  #swagger.responses[500] = { description: 'Server error' }
  */
  `${USER_BASIC_ROUTE}/newUser`,
  validateNewUser,
  compareCodeMiddleware,
  registerUser
);

router.patch(
  /* 
  #swagger.path = '/api/user/editUser'
  #swagger.tags = ['Users']
  #swagger.description = 'Edit the authenticated user. All fields are optional; only provided fields will be updated.'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      nameUser: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', example: 'juan@example.com' },
      additionalInformation: {
        type: 'object',
        additionalProperties: true,
        example: {
          bio: 'I love electronic music',
          instagram: '@juan_music'
        }
      }
    }
  }
  #swagger.responses[200] = { description: 'User updated successfully' }
  #swagger.responses[400] = { description: 'Invalid or missing fields' }
  #swagger.responses[401] = { description: 'Unauthorized, no token provided' }
  #swagger.responses[403] = { description: 'Invalid or expired token' }
  #swagger.responses[500] = { description: 'Server error' }
  */
  `${USER_BASIC_ROUTE}/editUser`,
  authorization,
  validateEditUser,
  editUser
);

router.patch(
  /*
    #swagger.path = '/api/user/editUserPassword'
    #swagger.tags = ['Users']
    #swagger.summary = 'Change user password'
    #swagger.description = 'Allows the authenticated user to update their password using a verification code sent to their email. The email must match the one in the JWT token.'

    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token (JWT) for user authentication'
    }
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Verification code and new password to update the current password',
    required: true,
    schema: {
      code: 'a1B2c3',
      newPassword: 'MyNewStrongPassword456'
    }
  }

    #swagger.responses[400] = {
      description: 'Invalid code or validation error',
      schema: {
        error: 'Invalid code'
      }
    }

    #swagger.responses[401] = {
      description: 'Unauthorized - missing or invalid JWT',
      schema: {
        message: 'No token provided'
      }
    }

    #swagger.responses[403] = {
      description: 'The email in the token does not match the body email',
      schema: {
        error: 'Email does not match token'
      }
    }

    #swagger.responses[404] = {
      description: 'User not found',
      schema: {
        error: 'User not found'
      }
    }

    #swagger.responses[428] = {
      description: 'Precondition Required - the code has expired or was never sent',
      schema: {
        error: 'Code expired or not found'
      }
    }

    #swagger.responses[500] = {
      description: 'Server error while trying to update password',
      schema: {
        error: 'Failed to update password'
      }
    }
  */
  `${USER_BASIC_ROUTE}/editUserPassword`,
  authorization,
  validateEditUserPassword,
  editUserPasswordController,
);


module.exports = router;
