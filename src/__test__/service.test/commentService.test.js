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

  test('getCommentsBySong y getCommentById deben devolver la misma estructura', async () => {
    const c1 = await commentService.createComment(77, 'user', 'Comentario raíz');
    const r1 = await commentService.addResponseToComment(c1._id, 'user2', 'Respuesta 1');
    const r1_1 = await commentService.addResponseToComment(r1._id, 'user3', 'Respuesta a R1');
  
    const porCancion = await commentService.getCommentsBySong(77);
    const porId = await commentService.getCommentById(c1._id);
  
    expect(porCancion.length).toBe(1);
    expect(porCancion[0]._id.toString()).toBe(porId._id.toString());
    expect(porCancion[0].message).toBe(porId.message);
    expect(porCancion[0].user).toBe(porId.user);
    expect(porCancion[0].responses.length).toBe(porId.responses.length);
    expect(porCancion[0].responses[0].message).toBe(porId.responses[0].message);
    expect(porCancion[0].responses[0].responses[0].message).toBe(porId.responses[0].responses[0].message);
    //FIXME:Erase Very sensitive 
    expect(JSON.stringify(porCancion[0])).toBe(JSON.stringify(porId));

  });
  
});


