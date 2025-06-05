const playlistServiceModule = require('../../service/playlist.service');
const songRepo = require('../../repositories/song.repository');
const { NonexistentPlaylist } = require('../../service/exceptions/exceptions');

jest.mock('../../repositories/song.repository');

describe('playlist.service - cleanPlaylistSongs', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should throw NonexistentPlaylist if playlist does not exist', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue(null);

    await expect(playlistServiceModule.cleanPlaylistSongs('playlist123'))
      .rejects.toThrow(NonexistentPlaylist);
  });

  test('should return empty array if playlist has no songs', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue({ songs: [] });

    const result = await playlistServiceModule.cleanPlaylistSongs('playlist123');
    expect(result).toEqual([]);
  });

  test('should remove non-existent songs and update playlist', async () => {
    const playlist = { songs: [{ song_id: 1 }, { song_id: 2 }] };
    const existingSongs = [{ idSong: 1 }];

    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue(playlist);
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'updatePlaylistById')
      .mockResolvedValue(true);
    songRepo.getSongsByIds.mockResolvedValue(existingSongs);

    const result = await playlistServiceModule.cleanPlaylistSongs('playlist-id');

    expect(result).toEqual([2]);
  });
});

describe('playlist.service - editPlaylistService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should throw NonexistentPlaylist if playlist does not exist', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue(null);

    await expect(playlistServiceModule.editPlaylistService('pid', 1, {}))
      .rejects.toThrow(NonexistentPlaylist);
  });

  test('should throw error if user is not the owner', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue({ creator_id: 999 });

    await expect(playlistServiceModule.editPlaylistService('pid', 1, {}))
      .rejects.toThrow('Acceso denegado');
  });

  test('should update playlist with given fields', async () => {
    const playlist = { creator_id: 1 };
    const payload = { playlist_name: 'New', description: 'Desc' };
    const updated = { ...playlist, ...payload };

    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue(playlist);
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'updatePlaylistById')
      .mockResolvedValue(updated);

    const result = await playlistServiceModule.editPlaylistService('pid', 1, payload);
    expect(result).toEqual(updated);
  });

  test('should throw if update fails', async () => {
    const playlist = { creator_id: 1 };

    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistById')
      .mockResolvedValue(playlist);
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'updatePlaylistById')
      .mockResolvedValue(null);

    await expect(playlistServiceModule.editPlaylistService('pid', 1, {}))
      .rejects.toThrow(NonexistentPlaylist);
  });
});

describe('playlist.service - getPlaylistService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return playlists for a valid user', async () => {
    const mockPlaylists = [{ id: 1, name: 'My Playlist' }];
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistsByCreatorId')
      .mockResolvedValue(mockPlaylists);

    const result = await playlistServiceModule.getPlaylistService(123);
    expect(result).toEqual(mockPlaylists);
  });

  test('should throw NonexistentPlaylist if no playlists found', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'getPlaylistsByCreatorId')
      .mockResolvedValue(null);

    await expect(playlistServiceModule.getPlaylistService(123))
      .rejects.toThrow(NonexistentPlaylist);
  });
});

describe('playlist.service - removeSongToPlaylistService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call removeSongFromPlaylist without error', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'removeSongFromPlaylist')
      .mockResolvedValue({ success: true });

    await expect(playlistServiceModule.removeSongToPlaylistService('pid1', 99))
      .resolves.toBeUndefined();
  });

  test('should throw NonexistentPlaylist if song is not removed', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'removeSongFromPlaylist')
      .mockResolvedValue(null); 

    await expect(playlistServiceModule.removeSongToPlaylistService('pid1', 99))
      .rejects.toThrow(NonexistentPlaylist);
  });
});

describe('playlist.service - addSongToPlaylistService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call addSongToPlaylist successfully', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'addSongToPlaylist')
      .mockResolvedValue({ success: true });

    await expect(playlistServiceModule.addSongToPlaylistService('pid1', 101))
      .resolves.toBeUndefined();
  });

  test('should throw NonexistentPlaylist if song not added', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'addSongToPlaylist')
      .mockResolvedValue(null);

    await expect(playlistServiceModule.addSongToPlaylistService('pid1', 101))
      .rejects.toThrow(NonexistentPlaylist);
  });
});

describe('playlist.service - deletePlaylistService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should delete playlist and remove image if present', async () => {
    const mockDeleted = { image_path: 'cover.jpg' };
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'deletePlaylistById')
      .mockResolvedValue(mockDeleted);

    const mockDeleteImage = jest.spyOn(playlistServiceModule.fileManager, 'deleteImage')
      .mockResolvedValue(true);

    await playlistServiceModule.deletePlaylistService('pid1');

    expect(mockDeleteImage).toHaveBeenCalledWith('cover', 'jpg');
  });

  test('should delete playlist with no image without calling deleteImage', async () => {
    const mockDeleted = { image_path: null };
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'deletePlaylistById')
      .mockResolvedValue(mockDeleted);

    const mockDeleteImage = jest.spyOn(playlistServiceModule.fileManager, 'deleteImage');

    await playlistServiceModule.deletePlaylistService('pid1');

    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('should throw NonexistentPlaylist if playlist not found', async () => {
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'deletePlaylistById')
      .mockResolvedValue(null);

    await expect(playlistServiceModule.deletePlaylistService('pid1'))
      .rejects.toThrow(NonexistentPlaylist);
  });

  test('should catch and warn if image deletion fails', async () => {
    const mockDeleted = { image_path: 'fail.jpg' };
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'deletePlaylistById')
      .mockResolvedValue(mockDeleted);

    jest.spyOn(playlistServiceModule.fileManager, 'deleteImage')
      .mockRejectedValue(new Error('FS error'));

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await playlistServiceModule.deletePlaylistService('pid1');

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[deletePlaylistService] Could not delete image'),
      'FS error'
    );
  });
});

describe('playlist.service - createPlaylistService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call moveTempImage and createPlaylist successfully', async () => {
    const mockMove = jest.spyOn(playlistServiceModule.fileManager, 'moveTempImage')
      .mockResolvedValue();
    const mockCreate = jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'createPlaylist')
      .mockResolvedValue({ id: 'p1', playlist_name: 'My Playlist' });

    const result = await playlistServiceModule.createPlaylistService({
      userId: 1,
      playlistName: 'My Playlist',
      description: 'Cool songs',
      fileName: 'cover.jpg',
      tempPath: '/tmp/cover.jpg',
    });

    expect(mockMove).toHaveBeenCalledWith('/tmp/cover.jpg', 'cover.jpg');
    expect(mockCreate).toHaveBeenCalledWith({
      creator_id: 1,
      playlist_name: 'My Playlist',
      description: 'Cool songs',
      image_path: 'cover.jpg',
      songs: [],
    });
    expect(result).toEqual({ id: 'p1', playlist_name: 'My Playlist' });
  });

  test('should throw if moveTempImage fails', async () => {
    jest.spyOn(playlistServiceModule.fileManager, 'moveTempImage')
      .mockRejectedValue(new Error('FS move error'));

    await expect(playlistServiceModule.createPlaylistService({
      userId: 1,
      playlistName: 'Error Playlist',
      description: 'Bad',
      fileName: 'bad.jpg',
      tempPath: '/tmp/bad.jpg',
    })).rejects.toThrow('FS move error');
  });

  test('should throw if createPlaylist fails', async () => {
    jest.spyOn(playlistServiceModule.fileManager, 'moveTempImage')
      .mockResolvedValue();
    jest.spyOn(require('../../repositories/playlist.mongo.repository').prototype, 'createPlaylist')
      .mockRejectedValue(new Error('DB error'));

    await expect(playlistServiceModule.createPlaylistService({
      userId: 1,
      playlistName: 'Another Playlist',
      description: 'Failed save',
      fileName: 'fail.jpg',
      tempPath: '/tmp/fail.jpg',
    })).rejects.toThrow('DB error');
  });
});

describe('playlist.service - getImageUrl', () => {
  test('should return valid URL when given valid params', () => {
    const url = playlistServiceModule.getImageUrl('https', 'example.com', 'cover.jpg');
    expect(url).toBe('https://example.com/images/playlists/cover.jpg');
  });

  test('should throw error when filename is missing', () => {
    expect(() => playlistServiceModule.getImageUrl('https', 'example.com')).toThrow(
      'Filename is required to generate URL'
    );
  });
});