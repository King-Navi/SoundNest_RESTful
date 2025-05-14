/**
 * @file swagger.js
 * @description Este archivo genera automáticamente la documentación Swagger
 * de la API RESTful utilizando la librería 'swagger-autogen'.
 *
 * Para ejecutarlo, corre: `node swagger-UI/swagger.js`
 * Esto generará un archivo `swagger-output.json` que puede ser usado por Swagger UI.
 *
 * Requiere comentarios en las rutas usando el formato `#swagger` para que puedan
 * ser interpretadas correctamente.
 *
 * @requires swagger-autogen
 */
const fs = require('fs');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'SoundNest API',
    description: 'Documentación de mi API RESTful',
  },
  host: 'localhost:6969',
  schemes: ['https', 'http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './src/routes/auth.route.js',
  './src/routes/user.route.js',
  './src/routes/comment.route.js',
  './src/routes/notification.route.js',
  './src/routes/song.route.js'
  //TODO: ¡add more routes here!
];

endpointsFiles.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.warn(`Ruta no encontrada: ${file}`);
  }
});

console.log('Generando documentación...');

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentación generada');
});
