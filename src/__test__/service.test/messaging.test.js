const mockGetRawCommentById = jest.fn();
const mockAlertUsersOfEventCommentReply = jest.fn();
const mockAlertUsersOfEventSongVisits = jest.fn();
const mockGetVisualizationsBySongId = jest.fn();


jest.mock('../../repositories/ComentarioRepository.mongo.repository', () => {
  return jest.fn().mockImplementation(() => ({
    getRawCommentById: mockGetRawCommentById,
  }));
});

jest.mock('../../messaging/alertEvents/commentReply.producer', () => ({
  alertUsersOfEventCommentReply: mockAlertUsersOfEventCommentReply,
}));

jest.mock('../../messaging/alertEvents/songVisits.producer', () => ({
  alertUsersOfEventSongVisits: mockAlertUsersOfEventSongVisits,
}));

jest.mock('../../repositories/visualization.repository', () => ({
  getVisualizationsBySongId: mockGetVisualizationsBySongId,
}));

const {
  checkAndNotifySongVisits,
  notifyOnCommentReply,
} = require('../../service/messaging.service');

const visualizationRepo = require('../../repositories/visualization.repository');
const songVisitProducer = require('../../messaging/alertEvents/songVisits.producer');
const commentProducer = require('../../messaging/alertEvents/commentReply.producer');

describe('checkAndNotifySongVisits', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should throw if song is missing', async () => {
    await expect(checkAndNotifySongVisits(null)).rejects.toThrow('Invalid or missing song');
  });

  test('should not notify if totalVisits is not multiple of 5', async () => {
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue([{ playCount: 3 }]);

    await checkAndNotifySongVisits({ idSong: 1 });
    expect(songVisitProducer.alertUsersOfEventSongVisits).not.toHaveBeenCalled();
  });

  test('should notify if totalVisits is multiple of 5', async () => {
    visualizationRepo.getVisualizationsBySongId.mockResolvedValue([
      { playCount: 3 },
      { playCount: 2 },
    ]);

    const song = {
      idSong: 1,
      songName: 'Test Song',
      idAppUser: 42,
      idAppUser_AppUser: { nameUser: 'Artist' },
    };

    await checkAndNotifySongVisits(song);

    expect(songVisitProducer.alertUsersOfEventSongVisits).toHaveBeenCalledWith({
      userId: 42,
      userName: 'Artist',
      songId: 1,
      songName: 'Test Song',
      visitCount: 5,
    });
  });
});

describe('notifyOnCommentReply', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should throw if commentId is missing', async () => {
    await expect(notifyOnCommentReply({})).rejects.toThrow('Missing commentId');
  });

  test('should throw if sender info is missing', async () => {
    await expect(
      notifyOnCommentReply({ commentId: 'abc' })
    ).rejects.toThrow('Missing sender information');
  });

  test('should throw if messageContent is missing', async () => {
    await expect(
      notifyOnCommentReply({ commentId: 'abc', senderId: 1, senderName: 'Alice' })
    ).rejects.toThrow('Missing messageContent');
  });

  test('should throw if original comment not found', async () => {
    mockGetRawCommentById.mockResolvedValue(null);

    await expect(
      notifyOnCommentReply({
        commentId: 'abc',
        senderId: 1,
        senderName: 'Alice',
        messageContent: 'Hi!',
      })
    ).rejects.toThrow('Original comment with ID abc not found');
  });

  test('should call alertUsersOfEventCommentReply with correct payload', async () => {
    mockGetRawCommentById.mockResolvedValue({
      author_id: 99,
      user: 'Bob',
    });

    await notifyOnCommentReply({
      commentId: 'abc',
      senderId: 1,
      senderName: 'Alice',
      messageContent: 'Thanks!',
    });

    expect(commentProducer.alertUsersOfEventCommentReply).toHaveBeenCalledWith({
      senderId: 1,
      senderName: 'Alice',
      messageContent: 'Thanks!',
      recipientId: 99,
      recipientName: 'Bob',
    });
  });
});
