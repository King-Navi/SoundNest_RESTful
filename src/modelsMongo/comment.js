const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  responses: [{
    type: Schema.Types.ObjectId,
    ref: 'Response',
  }],
});

const commentSchema = new Schema({
  song_id:{
    type: Number,
    required : true
  },
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  responses: [responseSchema],
});

const Comment = mongoose.model('Comment', commentSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = { Comment, Response };
