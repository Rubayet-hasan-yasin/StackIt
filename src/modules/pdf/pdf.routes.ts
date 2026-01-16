import { Router } from 'express';
import { getPdfs, uploadPdf, deletePdf } from './pdf.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware/validate';
import { uploadPdfSchema } from './pdf.validation';
import multer from 'multer';

const storage = multer.memoryStorage();

const pdfFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter: pdfFilter,
});

const router = Router();

// Get all PDFs
router.get('/', authenticate, getPdfs);

// Upload a PDF
router.post('/upload', authenticate, upload.single('pdf'), validate(uploadPdfSchema), uploadPdf);

// Delete a PDF
router.delete('/:id', authenticate, deletePdf);

export default router;
