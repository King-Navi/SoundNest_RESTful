const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  creator_id: {
    type: Number,
    required: true,
  },
  playlist_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_path: {
    type: String,
    required: true,
  },
  songs: [
    {
      song_id: {
        type: Number,
        required: false,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = { Playlist };
