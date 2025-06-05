const mongoose = require("mongoose");

const mockCreate = jest.fn();
const mockFindById = jest.fn();
const mockFindAll = jest.fn();
const mockUpdateById = jest.fn();
const mockDeleteById = jest.fn();
const mockMarkAsRead = jest.fn();

jest.mock("../../repositories/notification.mongo.repository", () => {
  return jest.fn().mockImplementation(() => ({
    create: mockCreate,
    findById: mockFindById,
    findAll: mockFindAll,
    updateById: mockUpdateById,
    deleteById: mockDeleteById,
    markAsRead: mockMarkAsRead,
  }));
});

const notificationService = require("../../service/notification.service");

describe("notificationService.createNotification", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should create and return the notification", async () => {
    const fakeNotification = { title: "Test", user_id: 1 };
    mockCreate.mockResolvedValue(fakeNotification);

    const result = await notificationService.createNotification(
      fakeNotification
    );

    expect(mockCreate).toHaveBeenCalledWith(fakeNotification);
    expect(result).toBe(fakeNotification);
  });
});

describe("notificationService.getNotificationById", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should throw error if id is invalid", async () => {
    await expect(
      notificationService.getNotificationById("invalid-id")
    ).rejects.toThrow("Invalid ID format");
    expect(mockFindById).not.toHaveBeenCalled();
  });

  test("should throw error if notification not found", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    mockFindById.mockResolvedValue(null);

    await expect(
      notificationService.getNotificationById(validId)
    ).rejects.toThrow("Notification not found");
    expect(mockFindById).toHaveBeenCalledWith(validId);
  });

  test("should return notification if found", async () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const notification = { _id: validId, title: "Hello" };
    mockFindById.mockResolvedValue(notification);

    const result = await notificationService.getNotificationById(validId);

    expect(mockFindById).toHaveBeenCalledWith(validId);
    expect(result).toBe(notification);
  });
});

describe("notificationService.getAllNotificationsForUser", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should return all notifications for given user ID", async () => {
    const userId = 42;
    const notifications = [{ title: "Welcome" }, { title: "Reminder" }];
    mockFindAll.mockResolvedValue(notifications);

    const result = await notificationService.getAllNotificationsForUser(userId);

    expect(mockFindAll).toHaveBeenCalledWith(userId);
    expect(result).toBe(notifications);
  });
});

describe("notificationService.updateNotificationById", () => {
  beforeEach(() => jest.clearAllMocks());

  test("should update and return the notification", async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const updateData = { read: true };
    const updated = { _id: id, read: true };

    mockUpdateById.mockResolvedValue(updated);

    const result = await notificationService.updateNotificationById(
      id,
      updateData
    );

    expect(mockUpdateById).toHaveBeenCalledWith(id, updateData);
    expect(result).toBe(updated);
  });

  test("should throw error if update failed", async () => {
    const id = new mongoose.Types.ObjectId().toString();
    mockUpdateById.mockResolvedValue(null);

    await expect(
      notificationService.updateNotificationById(id, { read: true })
    ).rejects.toThrow("Notification not found or update failed");
  });
});

describe('notificationService.deleteNotificationById', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should delete and return the notification if found', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const deleted = { _id: id, title: 'Deleted' };
    mockDeleteById.mockResolvedValue(deleted);

    const result = await notificationService.deleteNotificationById(id);

    expect(mockDeleteById).toHaveBeenCalledWith(id);
    expect(result).toBe(deleted);
  });

  test('should throw error if delete failed', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    mockDeleteById.mockResolvedValue(null);

    await expect(
      notificationService.deleteNotificationById(id)
    ).rejects.toThrow('Notification not found or delete failed');
  });
});

describe('notificationService.markNotificationAsRead', () => {
  beforeEach(() => jest.clearAllMocks());

  test('should throw error if ID format is invalid', async () => {
    await expect(
      notificationService.markNotificationAsRead('invalid-id')
    ).rejects.toThrow('Invalid ID format');
  });

  test('should call markAsRead with valid ID', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const updated = { _id: id, read: true };
    mockMarkAsRead.mockResolvedValue(updated);

    const result = await notificationService.markNotificationAsRead(id);

    expect(mockMarkAsRead).toHaveBeenCalledWith(id);
    expect(result).toBe(updated);
  });
});