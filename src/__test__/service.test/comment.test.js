const mockCreateComment = jest.fn();
const mockGetCommentsBySong = jest.fn();
const mockGetCommentById = jest.fn();
const mockAddResponseToComment = jest.fn();
const mockDeleteComment = jest.fn();
const mockGetFlatResponsesByCommentId = jest.fn();

jest.mock('../../repositories/ComentarioRepository.mongo.repository', () => {
  return jest.fn().mockImplementation(() => ({
    createComment: mockCreateComment,
    getCommentsBySong: mockGetCommentsBySong,
    getCommentById: mockGetCommentById,
    addResponseToComment: mockAddResponseToComment,
    deleteComment: mockDeleteComment,
    getFlatResponsesByCommentId: mockGetFlatResponsesByCommentId,
  }));
});

jest.mock('../../repositories/song.repository', () => ({
  verifySongExists: jest.fn(),
}));

const MockedCommentRepo = require('../../repositories/ComentarioRepository.mongo.repository');


const commentService = require('../../service/comment.service');
const { NonexistentSong } = require('../../service/exceptions/exceptions');
const { verifySongExists } = require('../../repositories/song.repository');

describe('commentService.createComment', () => {
  const fakeComment = {
    _id: 'c1',
    song_id: 's1',
    message: 'nice song',
    user: 'User A',
    idUser: 'u1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a comment when song exists', async () => {
    verifySongExists.mockResolvedValue(true);
    mockCreateComment.mockResolvedValue(fakeComment);

    const result = await commentService.createComment(
      's1',
      'User A',
      'nice song',
      'u1'
    );

    expect(verifySongExists).toHaveBeenCalledWith('s1');
    expect(mockCreateComment).toHaveBeenCalledWith('s1', 'User A', 'nice song', 'u1');
    expect(result).toBe(fakeComment);
  });

  test('should throw NonexistentSong if song does not exist', async () => {
    verifySongExists.mockResolvedValue(false);

    await expect(
      commentService.createComment('s999', 'User A', 'test', 'u1')
    ).rejects.toThrow(NonexistentSong);

    expect(verifySongExists).toHaveBeenCalledWith('s999');
    expect(mockCreateComment).not.toHaveBeenCalled();
  });
});

describe('commentService.getCommentsBySong', () => {
  const sampleComment = {
    _id: 'c1',
    all_responses: [
      { _id: 'r1', parent_id: 'c1', message: 'respuesta 1' },
      { _id: 'r2', parent_id: 'r1', message: 'respuesta 1.1' },
    ],
    message: 'comentario',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return mapped comments via buildResponseTree', async () => {
    mockGetCommentsBySong.mockResolvedValue([sampleComment]);

    const result = await commentService.getCommentsBySong('songId');

    expect(mockGetCommentsBySong).toHaveBeenCalledWith('songId');
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('responses');
  });

  test('should throw a generic error on failure', async () => {
    mockGetCommentsBySong.mockRejectedValue(new Error('DB failed'));

    await expect(
      commentService.getCommentsBySong('anyId')
    ).rejects.toThrow('Error al obtener los comentarios');
  });
});

describe('commentService.getCommentById', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return null if comment does not exist', async () => {
    mockGetCommentById.mockResolvedValue(null);

    const result = await commentService.getCommentById('nonexistent-id');
    expect(mockGetCommentById).toHaveBeenCalledWith('nonexistent-id');
    expect(result).toBeNull();
  });

  test('should return a tree-structured comment if found', async () => {
    const comment = {
      _id: 'c1',
      message: 'parent',
      all_responses: [
        { _id: 'r1', parent_id: 'c1', message: 'res1' },
        { _id: 'r2', parent_id: 'r1', message: 'res2' },
      ],
    };

    mockGetCommentById.mockResolvedValue(comment);

    const result = await commentService.getCommentById('c1');
    expect(mockGetCommentById).toHaveBeenCalledWith('c1');
    expect(result).toHaveProperty('responses');
    expect(result.responses.length).toBe(1);
  });

  test('should throw a wrapped error if the repo call fails', async () => {
    mockGetCommentById.mockRejectedValue(new Error('DB error'));

    await expect(
      commentService.getCommentById('c1')
    ).rejects.toThrow('Error al obtener el comentario');
  });
});

describe('commentService.addResponseToComment', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return created response when successful', async () => {
    const newResponse = {
      _id: 'r1',
      parent_id: 'c1',
      message: 'respuesta',
      user: 'U1',
    };

    mockAddResponseToComment.mockResolvedValue(newResponse);

    const result = await commentService.addResponseToComment('c1', 'U1', 'respuesta', 'idU1');

    expect(mockAddResponseToComment).toHaveBeenCalledWith('c1', 'U1', 'respuesta', 'idU1');
    expect(result).toBe(newResponse);
  });

  test('should throw a wrapped error if the repo call fails', async () => {
    mockAddResponseToComment.mockRejectedValue(new Error('DB error'));

    await expect(
      commentService.addResponseToComment('c1', 'U1', 'msg', 'idU1')
    ).rejects.toThrow('Error al agregar la respuesta');
  });
});


describe('commentService.deleteComment', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a comment successfully', async () => {
    const deleted = { acknowledged: true, deletedCount: 1 };
    mockDeleteComment.mockResolvedValue(deleted);

    const result = await commentService.deleteComment('c1');

    expect(mockDeleteComment).toHaveBeenCalledWith('c1');
    expect(result).toBe(deleted);
  });

  test('should throw a wrapped error if deletion fails', async () => {
    mockDeleteComment.mockRejectedValue(new Error('DB error'));

    await expect(
      commentService.deleteComment('c1')
    ).rejects.toThrow('Error al eliminar el comentario');
  });
});

describe('commentService.getFlatResponses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return flat responses list when successful', async () => {
    const responses = [
      { _id: 'r1', parent_id: 'c1', message: 'res1' },
      { _id: 'r2', parent_id: 'c1', message: 'res2' },
    ];

    mockGetFlatResponsesByCommentId.mockResolvedValue(responses);

    const result = await commentService.getFlatResponses('c1');

    expect(mockGetFlatResponsesByCommentId).toHaveBeenCalledWith('c1');
    expect(result).toBe(responses);
  });

  test('should throw a wrapped error if retrieval fails', async () => {
    mockGetFlatResponsesByCommentId.mockRejectedValue(new Error('DB error'));

    await expect(
      commentService.getFlatResponses('c1')
    ).rejects.toThrow('Error al obtener respuestas del comentario');
  });
});