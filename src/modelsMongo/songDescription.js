const mongoose = require("mongoose");

const songDescriptionSchema = new mongoose.Schema({
    songs_id: {
        type: Number,
        required: true,
        unique: true,
    },
    author_id: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SongDescription = mongoose.model("SongDescription", songDescriptionSchema);
module.exports = { SongDescription };
