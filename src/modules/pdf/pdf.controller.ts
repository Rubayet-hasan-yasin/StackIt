import { Request, Response } from 'express';
import { pdfService } from './pdf.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getPdfs = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { folderId } = req.query;

    const pdfs = await pdfService.getPdfs(user._id.toString(), folderId as string);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: pdfs,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get PDFs',
    });
  }
};

export const uploadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const file = req.file;
    const { name, folderId } = req.body;

    if (!file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'PDF file is required',
      });
      return;
    }

    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'PDF name is required',
      });
      return;
    }

    const pdf = await pdfService.uploadPdf(
      user._id.toString(),
      name,
      file,
      folderId
    );

    res.status(HTTP_STATUS.CREATED).json({
      status: API_STATUS.OK,
      message: 'PDF uploaded successfully',
      data: pdf,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to upload PDF',
    });
  }
};

export const deletePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    await pdfService.deletePdf(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'PDF deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete PDF',
    });
  }
};
