import { Router } from 'express';
import { getNotes, getNoteById, createNote, updateNote, deleteNote } from './note.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware/validate';
import { createNoteSchema, updateNoteSchema } from './note.validation';

const router = Router();

// notes
router.get('/', authenticate, getNotes);

// new note
router.post('/', authenticate, validate(createNoteSchema), createNote);

// single note
router.get('/:id', authenticate, getNoteById);

// update note
router.put('/:id', authenticate, validate(updateNoteSchema), updateNote);

// delete note
router.delete('/:id', authenticate, deleteNote);

export default router;
