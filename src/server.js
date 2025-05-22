require("dotenv").config();
const https = require("https");
const http = require("http");
const multer = require("multer");
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-UI/swagger-output.json");
const { loadTLSCredentials } = require("./config/tlsConfig");
const initializeDatabase = require("./config/database");
const { connectWithRetry } = require("./config/rabbit");
const { notificationConsumer } = require("./messaging/notification.consumer");
const authRoutes = require("./routes/auth.route");
const commentRoutes = require("./routes/comment.route");
const notificationRoutes = require("./routes/notification.route");
const playlistRoutes = require("./routes/playlist.route");
const songRutes = require("./routes/song.route");
const userRutes = require("./routes/user.route");
const visualizationRutes = require("./routes/visualization.route");
const app = express();
const httpsPort = process.env.PORT || 3000;
const httpPort = 6970;

const credentials = loadTLSCredentials();

const playlistImagePath = process.env.PLAYLIST_IMAGE_PATH_JS;
const songImagePath = process.env.SONGS_IMAGE_PATH_JS;

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});
app.use(authRoutes);
app.use(commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(playlistRoutes);
app.use(songRutes);
app.use(userRutes);
app.use(visualizationRutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/images/songs", express.static(path.resolve(songImagePath)));
app.use("/images/playlists", express.static(path.resolve(playlistImagePath)));
app.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err.message.includes("Only .png and .jpg")
  ) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Unexpected CRITICAL server error" });
});

initializeDatabase()
  .then(async () => {
    try {
      await connectWithRetry();
      await notificationConsumer();
    } catch (err) {
      console.error("RabbitMQ connection failed:", err);
      process.exit(1);
    }
    if (credentials) {
      https.createServer(credentials, app).listen(httpsPort, () => {
        console.log(`Server running on https://localhost:${httpsPort}`);
      });
    } else {
      http.createServer(app).listen(httpPort, () => {
        console.log(`Server running on http://localhost:${httpPort}`);
      });
    }
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
