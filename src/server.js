require("dotenv").config();
const https = require("https");
const http = require("http");
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-UI/swagger-output.json");
const { loadTLSCredentials } = require("./config/tlsConfig");
const initializeDatabase = require("./config/database");

const authRoutes = require("./routes/auth.route");
const commentRoutes = require("./routes/comment.route");
const notificationRoutes = require("./routes/notification.route");
const playlistRoutes = require("./routes/playlist.route");
const songRutes = require("./routes/song.route");
const userRutes = require("./routes/user.route");

const app = express();
const httpsPort = process.env.PORT || 3000;
const httpPort = 6970;

const credentials = loadTLSCredentials();

const playlistImagePath = process.env.PLAYLIST_IMAGE_PATH_JS;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(playlistRoutes);
app.use(songRutes);
app.use(userRutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
//TODO: MORE SECURITY:
app.use("/images/playlists", express.static(path.resolve(playlistImagePath)));
app.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err.message.includes("Only .png and .jpg")
  ) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: "Unexpected CRITICAL server error" });
});

initializeDatabase()
  .then(() => {
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
