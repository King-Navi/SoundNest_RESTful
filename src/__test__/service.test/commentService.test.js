require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongo } = require('../../config/databaseMongo');
const commentService = require('../../service/comment.service');
const { Comment } = require('../../modelsMongo/comment');

describe('Comment Service with real MongoDB', () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      
    }
  });

  beforeEach(async () => {
    await Comment.deleteMany({});
  });

  afterEach(async () => {
    await Comment.deleteMany({});
  });

  test('createComment should create a comment', async () => {
    const song_id = 123;
    const user = 'user1';
    const message = 'Great song!';
  
    const comment = await commentService.createComment(song_id, user, message);
  
    expect(comment).toHaveProperty('_id');
    expect(comment.song_id).toBe(song_id);  
    expect(comment.user).toBe(user);
    expect(comment.message).toBe(message);
  });
  
  test('getCommentsBySong should return comments', async () => {
    const song_id = 123;
    await commentService.createComment(song_id, 'user1', 'Nice track!');
    await commentService.createComment(song_id, 'user2', 'Loved it!');
  
    const comments = await commentService.getCommentsBySong(song_id);
  
    expect(comments.length).toBe(2);
    expect(comments[0]).toHaveProperty('message');
  });
  
  test('getCommentById should return the correct comment', async () => {
    const created = await commentService.createComment(456, 'user3', 'Awesome!');
    const fetched = await commentService.getCommentById(created._id);
  
    expect(fetched._id.toString()).toBe(created._id.toString());
    expect(fetched.user).toBe('user3');
  });
  
  test('deleteComment should delete a comment', async () => {
    const created = await commentService.createComment(789, 'user4', 'Not bad');
    const deleted = await commentService.deleteComment(created._id);
  
    expect(deleted._id.toString()).toBe(created._id.toString());
  
    const check = await commentService.getCommentById(created._id);
    expect(check).toBeNull();
  });
  
});
