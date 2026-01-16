import File, { IFile } from '../file/file.model';
import { User } from '../user/user.model';

const bytesToGB = (bytes: number): number => {
  return bytes / (1024 * 1024 * 1024);
};

class NoteService {
  // Get all notes for a user
  async getNotes(userId: string, folderId?: string): Promise<IFile[]> {
    const query: any = { userId, type: 'note' };

    if (folderId !== undefined) {
      query.folderId = folderId === 'root' ? null : folderId;
    }

    const notes = await File.find(query).sort({ createdAt: -1 });
    return notes;
  }

  // Get a single note by ID
  async getNoteById(noteId: string, userId: string): Promise<IFile> {
    const note = await File.findOne({ _id: noteId, userId, type: 'note' });

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }

  // Create a new note
  async createNote(
    userId: string,
    name: string,
    content: string = '',
    folderId?: string
  ): Promise<IFile> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sizeInBytes = Buffer.byteLength(content, 'utf8');
    const sizeInGB = bytesToGB(sizeInBytes);

    if (user.usedStorage + sizeInGB > user.storageLimit) {
      throw new Error('Storage limit exceeded');
    }

    const note = await File.create({
      userId,
      type: 'note',
      name,
      content,
      filePath: null,
      size: sizeInBytes,
      folderId: folderId || null,
    });

    user.usedStorage += sizeInGB;
    await user.save();

    return note;
  }

  // Update note
  async updateNote(
    noteId: string,
    userId: string,
    name?: string,
    content?: string
  ): Promise<IFile> {
    const note = await File.findOne({ _id: noteId, userId, type: 'note' });

    if (!note) {
      throw new Error('Note not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (name) {
      note.name = name;
    }

    if (content !== undefined) {
      const oldSize = note.size;
      const newSize = Buffer.byteLength(content, 'utf8');
      const sizeDiff = newSize - oldSize;
      const sizeDiffGB = bytesToGB(sizeDiff);

      if (sizeDiff > 0 && user.usedStorage + sizeDiffGB > user.storageLimit) {
        throw new Error('Storage limit exceeded');
      }

      note.content = content;
      note.size = newSize;

      user.usedStorage += sizeDiffGB;
      await user.save();
    }

    await note.save();
    return note;
  }

  // Delete note
  async deleteNote(noteId: string, userId: string): Promise<void> {
    const note = await File.findOne({ _id: noteId, userId, type: 'note' });

    if (!note) {
      throw new Error('Note not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sizeInGB = bytesToGB(note.size);
    user.usedStorage = Math.max(0, user.usedStorage - sizeInGB);
    await user.save();

    await File.deleteOne({ _id: noteId });
  }
}

export const noteService = new NoteService();
