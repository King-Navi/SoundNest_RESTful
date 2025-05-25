const mongoose = require("mongoose");

const AdditionalInfoSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  info: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("AdditionalInfo", AdditionalInfoSchema);
