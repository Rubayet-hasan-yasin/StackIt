import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'jpg' | 'png' | 'webp';
}

export interface UploadResult {
  filename: string;
  path: string;
  url: string;
  size: number;
  mimetype: string;
}

export class UploadService {
  private uploadDir: string;
  private publicUrl: string;
  private isDevelopment: boolean;

  constructor(uploadDir: string = 'uploads', publicUrl: string = '/uploads') {
    this.uploadDir = path.join(process.cwd(), uploadDir);
    this.publicUrl = publicUrl;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

 
  async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Validate file is an image
  validateImage(mimetype: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    return allowedTypes.includes(mimetype);
  }

  // Validate file size (in bytes)
  validateFileSize(size: number, maxSize: number = 5 * 1024 * 1024): boolean {
    return size <= maxSize; // Default 5MB
  }

  // Process and save image
  async uploadImage(
    file: Express.Multer.File,
    options: ImageUploadOptions = {}
  ): Promise<UploadResult> {
    // Validate file type
    if (!this.validateImage(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Validate file size
    // if (!this.validateFileSize(file.size)) {
    //   throw new Error('File size exceeds 5MB limit.');
    // }

    // Generate unique filename
    const fileExt = options.format || 'jpeg';
    const filename = `${uuidv4()}.${fileExt}`;

    // Process image with sharp
    const sharpInstance = sharp(file.buffer)
      .resize(options.maxWidth || 800, options.maxHeight || 800, {
        fit: 'inside',
        withoutEnlargement: true,
      });

    // Set format and quality
    if (fileExt === 'jpeg' || fileExt === 'jpg') {
      sharpInstance.jpeg({ quality: options.quality || 90 });
    } else if (fileExt === 'png') {
      sharpInstance.png({ quality: options.quality || 90 });
    } else if (fileExt === 'webp') {
      sharpInstance.webp({ quality: options.quality || 90 });
    }

    // In development: save to local file system
    if (this.isDevelopment) {
      await this.ensureUploadDir();
      const filepath = path.join(this.uploadDir, filename);
      await sharpInstance.toFile(filepath);

      const stats = await fs.stat(filepath);

      return {
        filename,
        path: filepath,
        url: `${this.publicUrl}/${filename}`,
        size: stats.size,
        mimetype: `image/${fileExt}`,
      };
    }

    // In production: return processed buffer without saving to file system
    // In production, you should integrate with cloud storage (S3, Cloudinary, etc.)
    const buffer = await sharpInstance.toBuffer();

    return {
      filename,
      path: '', // No local path in production
      url: `${this.publicUrl}/${filename}`, // Return temporary URL or integrate with cloud storage
      size: buffer.length,
      mimetype: `image/${fileExt}`,
    };
  }

  // Upload avatar (specific dimensions for avatars)
  async uploadAvatar(file: Express.Multer.File): Promise<UploadResult> {
    return this.uploadImage(file, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
      format: 'jpeg',
    });
  }

  // Delete file
  async deleteFile(filename: string): Promise<void> {
    // Only delete files in development mode
    if (!this.isDevelopment) {
      console.log('Production mode: Skipping local file deletion');
      return;
    }

    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
    } catch (error) {
      // File doesn't exist or already deleted
      console.error('Error deleting file:', error);
    }
  }

  // Extract filename from URL
  getFilenameFromUrl(url: string): string | null {
    const match = url.match(/\/([^/]+)$/);
    return match ? match[1] : null;
  }
}

export const uploadService = new UploadService();
