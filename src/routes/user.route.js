const express = require("express");
const router = express.Router();
const {
  registerUser,
  editUser,
  editUserPasswordController,
  getAditionalInfoUserController,
} = require("../controllers/user.controller");
const compareCodeMiddleware = require("../middlewares/compareCode.middleware");
const authorization = require("../middlewares/auth.middleware");
const {
  validateEditUser,
  validateNewUser,
  validateEditUserPassword,
} = require("../middlewares/validateEditUser.middleware");

const USER_BASIC_ROUTE = "/api/user";

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

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: 'Email, confirmation code, and new password',
    schema: {
      email: 'user@example.com',
      code: 'a1B2c3',
      newPassword: 'MySecurePass123'
    }
  }
  */
  `${USER_BASIC_ROUTE}/editUserPassword`,
  validateEditUserPassword,
  editUserPasswordController
);

router.get(
  /*
    #swagger.path = '/api/user/get/aditionalInfo'
    #swagger.tags = ['Users']
    #swagger.summary = 'Retrieve additional user information'
    #swagger.description = `
    Returns additional information for the authenticated user.
    **Structure of 'info':**
    - The \`info\` object can contain any number of key-value pairs.
    - Each key is a string, and each value must be an **array of strings**.
    - This allows users to store flexible, categorized metadata (e.g., genres, interests, platforms).

    **Warning:**
    - The server does not validate the keys inside \`info\`; only the value format is expected (array of strings).
    - Ensure consistent naming on the client side to avoid data fragmentation (e.g., avoid using both 'Genres' and 'genres').

    **Example:**
    {
      "info": {
        "genres": ["rock", "electronic"],
        "platforms": ["Instagram", "Spotify"],
        "interests": ["coding", "DJing"]
      }
    }
    `
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token (JWT) for user authentication'
    }

    #swagger.responses[200] = {
      description: 'Additional information retrieved successfully',
      schema: {
        info: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'string',
              example: 'example string'
            }
          },
          example: {
            genres: ['rock', 'electronic'],
            interests: ['coding', 'music'],
            platforms: ['Instagram', 'Spotify']
          }
        }
      }
    }

    #swagger.responses[401] = {
      description: 'Unauthorized - missing or invalid JWT',
      schema: {
        message: 'No token provided'
      }
    }

    #swagger.responses[404] = {
      description: 'No additional information found for this user',
      schema: {
        error: 'No additional information found for this user.'
      }
    }

    #swagger.responses[500] = {
      description: 'Server error while retrieving additional information',
      schema: {
        error: 'Internal server error'
      }
    }
  */
  `${USER_BASIC_ROUTE}/get/aditionalInfo`,
  authorization,
  getAditionalInfoUserController
);

module.exports = router;
