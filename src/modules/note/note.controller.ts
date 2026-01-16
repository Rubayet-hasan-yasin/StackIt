import { Request, Response } from 'express';
import { noteService } from './note.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { folderId } = req.query;

    const notes = await noteService.getNotes(user._id.toString(), folderId as string);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: notes,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get notes',
    });
  }
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const note = await noteService.getNoteById(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: note,
    });
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Note not found',
    });
  }
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { name, content, folderId } = req.body;

    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'Note name is required',
      });
      return;
    }

    const note = await noteService.createNote(
      user._id.toString(),
      name,
      content || '',
      folderId
    );

    res.status(HTTP_STATUS.CREATED).json({
      status: API_STATUS.OK,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to create note',
    });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;
    const { name, content } = req.body;

    const note = await noteService.updateNote(
      id,
      user._id.toString(),
      name,
      content
    );

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to update note',
    });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    await noteService.deleteNote(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete note',
    });
  }
};
