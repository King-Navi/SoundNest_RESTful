const PlaylistRepository = require('../../repositories/playlist.mongo.repository');
const { Playlist } = require('../../modelsMongo/playlist');

jest.mock('../../modelsMongo/playlist');

describe('PlaylistRepository', () => {
  const repo = new PlaylistRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createPlaylist - should save and return a new playlist', async () => {
    const rawData = {
      playlist_name: 'Test',
      description: 'Desc',
      creator_id: 1,
      image_path: 'path.jpg',
      songs: []
    };

    const savedData = { ...rawData }; 
    const mockSave = jest.fn().mockResolvedValue(savedData);

    Playlist.mockImplementation(() => ({ save: mockSave }));

    const expected = {
      ...rawData,
      image_path: '/images/playlists/path.jpg',
    };

    const result = await repo.createPlaylist(rawData);

    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  test('getPlaylistById - should return playlist by id', async () => {
    const mockPlaylist = { id: '123', playlist_name: 'My Playlist' };
    Playlist.findById.mockResolvedValue(mockPlaylist);

    const result = await repo.getPlaylistById('123');

    expect(Playlist.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockPlaylist);
  });

  test('getAllPlaylists - should return all playlists', async () => {
    const mockPlaylists = [{ playlist_name: 'A' }, { playlist_name: 'B' }];
    Playlist.find.mockResolvedValue(mockPlaylists);

    const result = await repo.getAllPlaylists();

    expect(Playlist.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockPlaylists);
  });

  test('getPlaylistsByCreatorId - should return playlists by creator_id', async () => {
    const mockPlaylists = [{ creator_id: 1 }];
    Playlist.find.mockResolvedValue(mockPlaylists);

    const result = await repo.getPlaylistsByCreatorId(1);

    expect(Playlist.find).toHaveBeenCalledWith({ creator_id: 1 });
    expect(result).toEqual(mockPlaylists);
  });

  test('updatePlaylistById - should update and return the playlist', async () => {
    const updatedPlaylist = { playlist_name: 'Updated' };
    Playlist.findByIdAndUpdate.mockResolvedValue(updatedPlaylist);

    const result = await repo.updatePlaylistById('123', { playlist_name: 'Updated' });

    expect(Playlist.findByIdAndUpdate).toHaveBeenCalledWith('123', { playlist_name: 'Updated' }, { new: true });
    expect(result).toEqual(updatedPlaylist);
  });

  test('deletePlaylistById - should delete and return the playlist', async () => {
    const deleted = { playlist_name: 'Deleted' };
    Playlist.findByIdAndDelete.mockResolvedValue(deleted);

    const result = await repo.deletePlaylistById('123');

    expect(Playlist.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(result).toEqual(deleted);
  });

  test('addSongToPlaylist - should add a song to the playlist', async () => {
    const mockSave = jest.fn().mockResolvedValue({ songs: [{ song_id: 1 }] });

    Playlist.findById.mockResolvedValue({
      songs: [],
      save: mockSave,
    });

    const result = await repo.addSongToPlaylist('123', 1);

    expect(Playlist.findById).toHaveBeenCalledWith('123');
    expect(mockSave).toHaveBeenCalled();
    expect(result.songs).toEqual([{ song_id: 1 }]);
  });

  test('removeSongFromPlaylist - should remove a song from the playlist', async () => {
    const mockSave = jest.fn().mockImplementation(function () {
      return Promise.resolve(this);
    });

    Playlist.findById.mockResolvedValue({
      songs: [{ song_id: 1 }, { song_id: 2 }],
      save: mockSave,
    });

    const result = await repo.removeSongFromPlaylist('123', 1);

    expect(Playlist.findById).toHaveBeenCalledWith('123');
    expect(mockSave).toHaveBeenCalled();
    expect(result.songs).toEqual([{ song_id: 2 }]);
  });
});
