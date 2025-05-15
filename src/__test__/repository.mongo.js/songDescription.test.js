const SongDescriptionRepository = require('../../repositories/songDescription.mongo.reposiroty');
const { SongDescription } = require('../../modelsMongo/songDescription');

jest.mock('../../modelsMongo/songDescription');

describe('SongDescriptionRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new SongDescriptionRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería guardar una nueva descripción', async () => {
      const mockData = { songs_id: 1, author_id: 123, description: 'test' };
      const mockSave = jest.fn().mockResolvedValue(mockData);
      SongDescription.mockImplementation(() => ({ save: mockSave }));

      const result = await repository.create(mockData);

      expect(SongDescription).toHaveBeenCalledWith(mockData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('getBySongId', () => {
    it('debería obtener una descripción por songs_id', async () => {
      const mockResult = { songs_id: 1, description: 'abc' };
      SongDescription.findOne.mockResolvedValue(mockResult);

      const result = await repository.getBySongId(1);

      expect(SongDescription.findOne).toHaveBeenCalledWith({ songs_id: 1 });
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateBySongId', () => {
    it('debería actualizar y retornar la descripción actualizada', async () => {
      const updated = { songs_id: 1, description: 'nueva' };
      SongDescription.findOneAndUpdate.mockResolvedValue(updated);

      const result = await repository.updateBySongId(1, { description: 'nueva' });

      expect(SongDescription.findOneAndUpdate).toHaveBeenCalledWith(
        { songs_id: 1 },
        { $set: { description: 'nueva' } },
        { new: true }
      );
      expect(result).toEqual(updated);
    });
  });

  describe('deleteBySongId', () => {
    it('debería eliminar la descripción por songs_id', async () => {
      const mockDeleted = { songs_id: 1, description: 'borrar' };
      SongDescription.findOneAndDelete.mockResolvedValue(mockDeleted);

      const result = await repository.deleteBySongId(1);

      expect(SongDescription.findOneAndDelete).toHaveBeenCalledWith({ songs_id: 1 });
      expect(result).toEqual(mockDeleted);
    });
  });
});
