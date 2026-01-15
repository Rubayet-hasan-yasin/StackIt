import { User, IUser } from './user.model';
import { uploadService } from '../upload';

export class UserService {
  // Get user profile
  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId: string, name?: string, avatar?: string): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    return user;
  }

  // Update profile with avatar upload
  async updateProfileWithAvatar(userId: string, name?: string, avatarFile?: Express.Multer.File): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    
    if (name) user.name = name;

    
    if (avatarFile) {
      
      if (user.avatar && user.avatar.startsWith('/uploads/')) {
        const oldFilename = uploadService.getFilenameFromUrl(user.avatar);
        if (oldFilename) {
          await uploadService.deleteFile(oldFilename);
        }
      }

      
      const uploadResult = await uploadService.uploadAvatar(avatarFile);
      user.avatar = uploadResult.url;
    }

    await user.save();
    return user;
  }
}

export const userService = new UserService();
