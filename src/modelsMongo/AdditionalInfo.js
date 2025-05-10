const mongoose = require('mongoose');

const AdditionalInfoSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  info: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model('AdditionalInfo', AdditionalInfoSchema);