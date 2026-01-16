import File from '../file/file.model';
import Folder from '../folder/folder.model';
import { User } from '../user/user.model';

const bytesToGB = (bytes: number): number => {
  return bytes / (1024 * 1024 * 1024);
};

interface DashboardSummary {
  storage: {
    total: number; // GB
    used: number; // GB
    available: number; // GB
    usedPercentage: number;
  };
  folders: {
    total: number;
    storage: number; // GB (always 0 as folders don't use storage)
  };
  notes: {
    total: number;
    storage: number; // GB
  };
  images: {
    total: number;
    storage: number; // GB
  };
  pdfs: {
    total: number;
    storage: number; // GB
  };
}

class DashboardService {
  // Get dashboard summary
  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get counts and storage for each type
    const [notesData, imagesData, pdfsData, foldersCount] = await Promise.all([
      File.aggregate([
        { $match: { userId: user._id, type: 'note' } },
        { $group: { _id: null, count: { $sum: 1 }, totalSize: { $sum: '$size' } } },
      ]),
      File.aggregate([
        { $match: { userId: user._id, type: 'image' } },
        { $group: { _id: null, count: { $sum: 1 }, totalSize: { $sum: '$size' } } },
      ]),
      File.aggregate([
        { $match: { userId: user._id, type: 'pdf' } },
        { $group: { _id: null, count: { $sum: 1 }, totalSize: { $sum: '$size' } } },
      ]),
      Folder.countDocuments({ userId }),
    ]);

    const notes = notesData[0] || { count: 0, totalSize: 0 };
    const images = imagesData[0] || { count: 0, totalSize: 0 };
    const pdfs = pdfsData[0] || { count: 0, totalSize: 0 };

    const available = user.storageLimit - user.usedStorage;
    const usedPercentage = user.storageLimit > 0 
      ? (user.usedStorage / user.storageLimit) * 100 
      : 0;

    return {
      storage: {
        total: user.storageLimit,
        used: user.usedStorage,
        available: Math.max(0, available),
        usedPercentage: Math.round(usedPercentage * 100) / 100,
      },
      folders: {
        total: foldersCount,
        storage: 0, // Folders don't use storage
      },
      notes: {
        total: notes.count,
        storage: bytesToGB(notes.totalSize),
      },
      images: {
        total: images.count,
        storage: bytesToGB(images.totalSize),
      },
      pdfs: {
        total: pdfs.count,
        storage: bytesToGB(pdfs.totalSize),
      },
    };
  }

  // Get recent files
  async getRecentFiles(userId: string, limit: number = 10) {
    const recentFiles = await File.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return recentFiles;
  }

  // Global search across files
  async searchFiles(userId: string, keyword: string) {
    if (!keyword || keyword.trim().length === 0) {
      throw new Error('Search keyword is required');
    }

    const searchRegex = new RegExp(keyword, 'i'); // Case-insensitive search

    const files = await File.find({
      userId,
      $or: [
        { name: searchRegex },
        { content: searchRegex }, // For notes
        { url: searchRegex }, // For links
      ],
    }).sort({ createdAt: -1 });

    return files;
  }
}

export const dashboardService = new DashboardService();
