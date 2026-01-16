import Folder, { IFolder } from './folder.model';
import File from '../file/file.model';

class FolderService {
  // Get all folders for a user with optional parent filter
  async getFolders(userId: string, parentId?: string): Promise<IFolder[]> {
    const query: any = { userId };

    if (parentId !== undefined) {
      query.parentId = parentId === 'root' ? null : parentId;
    }

    const folders = await Folder.find(query).sort({ createdAt: -1 });
    return folders;
  }

  // Get a single folder by ID
  async getFolderById(folderId: string, userId: string): Promise<IFolder> {
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      throw new Error('Folder not found');
    }

    return folder;
  }

  // Create a new folder
  async createFolder(
    userId: string,
    name: string,
    parentId?: string
  ): Promise<IFolder> {
    // If parentId is provided, verify it exists and belongs to user
    if (parentId) {
      const parentFolder = await Folder.findOne({ _id: parentId, userId });
      if (!parentFolder) {
        throw new Error('Parent folder not found');
      }
    }

    const folder = await Folder.create({
      userId,
      name,
      parentId: parentId || null,
    });

    return folder;
  }

  // Update folder name
  async updateFolder(
    folderId: string,
    userId: string,
    name: string
  ): Promise<IFolder> {
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      throw new Error('Folder not found');
    }

    folder.name = name;
    await folder.save();

    return folder;
  }

  // Delete a folder (and optionally all contents)
  async deleteFolder(folderId: string, userId: string): Promise<void> {
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      throw new Error('Folder not found');
    }

    // Check if folder has subfolders or files
    const subfolders = await Folder.countDocuments({ parentId: folderId, userId });
    const files = await File.countDocuments({ folderId, userId });

    if (subfolders > 0 || files > 0) {
      throw new Error('Cannot delete folder with contents. Please delete all files and subfolders first.');
    }

    await Folder.deleteOne({ _id: folderId });
  }

  // Get all files in a folder
  async getFilesInFolder(folderId: string, userId: string) {
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      throw new Error('Folder not found');
    }

    const files = await File.find({ folderId, userId }).sort({ createdAt: -1 });
    return files;
  }
}

export const folderService = new FolderService();
