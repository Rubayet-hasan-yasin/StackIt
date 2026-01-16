import File, { IFile } from '../file/file.model';
import { User } from '../user/user.model';
import { uploadService } from '../upload';

const bytesToGB = (bytes: number): number => {
  return bytes / (1024 * 1024 * 1024);
};

class ImageService {
  // Get all images for a user
  async getImages(userId: string, folderId?: string): Promise<IFile[]> {
    const query: any = { userId, type: 'image' };

    if (folderId !== undefined) {
      query.folderId = folderId === 'root' ? null : folderId;
    }

    const images = await File.find(query).sort({ createdAt: -1 });
    return images;
  }

  // Upload an image
  async uploadImage(
    userId: string,
    name: string,
    file: Express.Multer.File,
    folderId?: string
  ): Promise<IFile> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sizeInBytes = file.size;
    const sizeInGB = bytesToGB(sizeInBytes);

    if (user.usedStorage + sizeInGB > user.storageLimit) {
      throw new Error('Storage limit exceeded');
    }

    const result = await uploadService.uploadImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 85,
    });

    const image = await File.create({
      userId,
      type: 'image',
      name,
      content: null,
      filePath: result.url,
      size: sizeInBytes,
      folderId: folderId || null,
    });

    user.usedStorage += sizeInGB;
    await user.save();

    return image;
  }

  // Delete an image
  async deleteImage(imageId: string, userId: string): Promise<void> {
    const image = await File.findOne({ _id: imageId, userId, type: 'image' });

    if (!image) {
      throw new Error('Image not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (image.filePath) {
      await uploadService.deleteFile(image.filePath);
    }

    const sizeInGB = bytesToGB(image.size);
    user.usedStorage = Math.max(0, user.usedStorage - sizeInGB);
    await user.save();

    await File.deleteOne({ _id: imageId });
  }
}

export const imageService = new ImageService();
