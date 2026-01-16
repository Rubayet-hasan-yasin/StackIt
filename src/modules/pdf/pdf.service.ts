import File, { IFile } from '../file/file.model';
import { User } from '../user/user.model';
import { uploadService } from '../upload';
import path from 'path';

const bytesToGB = (bytes: number): number => {
  return bytes / (1024 * 1024 * 1024);
};

class PdfService {
  // Get all PDFs for a user
  async getPdfs(userId: string, folderId?: string): Promise<IFile[]> {
    const query: any = { userId, type: 'pdf' };

    if (folderId !== undefined) {
      query.folderId = folderId === 'root' ? null : folderId;
    }

    const pdfs = await File.find(query).sort({ createdAt: -1 });
    return pdfs;
  }

  // Upload a PDF
  async uploadPdf(
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

    const ext = path.extname(file.originalname) || '.pdf';
    const filePath = await uploadService.uploadFile(file.buffer, 'pdfs', ext);

    const pdf = await File.create({
      userId,
      type: 'pdf',
      name,
      content: null,
      filePath,
      size: sizeInBytes,
      folderId: folderId || null,
    });

    user.usedStorage += sizeInGB;
    await user.save();

    return pdf;
  }

  // Delete a PDF
  async deletePdf(pdfId: string, userId: string): Promise<void> {
    const pdf = await File.findOne({ _id: pdfId, userId, type: 'pdf' });

    if (!pdf) {
      throw new Error('PDF not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (pdf.filePath) {
      await uploadService.deleteFile(pdf.filePath);
    }

    const sizeInGB = bytesToGB(pdf.size);
    user.usedStorage = Math.max(0, user.usedStorage - sizeInGB);
    await user.save();

    await File.deleteOne({ _id: pdfId });
  }
}

export const pdfService = new PdfService();
