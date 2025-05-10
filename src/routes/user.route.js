const express = require("express");
const router = express.Router();
const {registerUser, editUser} = require("../controllers/user.controller");
const compareCodeMiddleware = require("../middlewares/compareCode.middleware");
const authorization = require("../middlewares/auth.middleware");
const { validateEditUser , validateNewUser} = require("../middlewares/validateEditUser.middleware");

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
  "/newUser",
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
      password: { type: 'string', example: 'newPassword123' },
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
  "/editUser",
  authorization,
  validateEditUser,
  editUser
);

module.exports = router;
