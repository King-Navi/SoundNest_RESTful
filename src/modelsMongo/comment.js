const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const commentSchema = new Schema({
  song_id:{
    type: Number,
    required : true
  },
  author_id:{
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
});

commentSchema.virtual('responses', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent_id'
});

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = { Comment };