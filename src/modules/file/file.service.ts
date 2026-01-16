import File, { IFile, FileType } from './file.model';

class FileService {
  // Get all files for a user with optional filters
  async getFiles(
    userId: string,
    filters?: {
      type?: FileType;
      folderId?: string;
      isFavorite?: boolean;
    }
  ): Promise<IFile[]> {
    const query: any = { userId };

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.folderId !== undefined) {
      query.folderId = filters.folderId === 'root' ? null : filters.folderId;
    }

    if (filters?.isFavorite !== undefined) {
      query.isFavorite = filters.isFavorite;
    }

    const files = await File.find(query).sort({ createdAt: -1 });
    return files;
  }

  // Get a single file by ID
  async getFileById(fileId: string, userId: string): Promise<IFile> {
    const file = await File.findOne({ _id: fileId, userId });

    if (!file) {
      throw new Error('File not found');
    }

    return file;
  }

  // Delete a file
  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await File.findOne({ _id: fileId, userId });

    if (!file) {
      throw new Error('File not found');
    }

    await File.deleteOne({ _id: fileId });
  }
}

export const fileService = new FileService();
