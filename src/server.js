require('dotenv').config();
const https = require('https');
const http = require('http');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-UI/swagger-output.json');
const { loadTLSCredentials } = require('./config/tlsConfig');
const initializeDatabase = require('./config/database');

const authRoutes = require('./routes/auth.route');
const commentRoutes = require('./routes/comment.route');
const notificationRoutes = require('./routes/notification.route');
const userRutes = require('./routes/user.route');


const app = express();
const httpsPort = process.env.PORT || 3000;
const httpPort = 6970;  //  fallback HTTP TODO: Add to .env

const credentials = loadTLSCredentials();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/notifications', notificationRoutes)
app.use('/api/user', userRutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

initializeDatabase().then(() => {
  if (credentials) {
    https.createServer(credentials, app).listen(httpsPort, () => {
      console.log(`Server running on https://localhost:${httpsPort}`);
    });
  } else {
    http.createServer(app).listen(httpPort, () => {
      console.log(`Server running on http://localhost:${httpPort}`);
    });
  }
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});;