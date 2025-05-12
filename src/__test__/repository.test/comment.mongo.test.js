const mongoose = require('mongoose');
const { Comment } = require('../../modelsMongo/comment');
const CommentRepository = require('../../repositories/ComentarioRepository.mongo.repository');
const { connectMongo } = require('../../config/databaseMongo');

let repository;

beforeAll(async () => {
    await connectMongo();
    repository = new CommentRepository();
  });

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await Comment.deleteMany();
});

describe('CommentRepository.getCommentsBySong', () => {
  it('should return a comment with nested responses', async () => {
    const songId = 1;
    const root = await repository.createComment(songId, 'user1', 'Comentario principal');
    const r1 = await repository.addResponseToComment(root._id, 'user2', 'Respuesta 1');
    const r2 = await repository.addResponseToComment(root._id, 'user3', 'Respuesta 2');
    const r1_1 = await repository.addResponseToComment(r1._id, 'user4', 'Respuesta a Respuesta 1');

    const comentarios = await repository.getCommentsBySong(songId);

    expect(comentarios.length).toBe(1);
    const [comentario] = comentarios;

    expect(comentario.message).toBe('Comentario principal');
    expect(comentario.all_responses.length).toBe(3);

    const ids = comentario.all_responses.map(r => r.message);
    expect(ids).toContain('Respuesta 1');
    expect(ids).toContain('Respuesta 2');
    expect(ids).toContain('Respuesta a Respuesta 1');
  });

  it('should return an empty array if no comments exist for the song', async () => {
    const comentarios = await repository.getCommentsBySong(999);
    expect(comentarios).toEqual([]);
  });
});
