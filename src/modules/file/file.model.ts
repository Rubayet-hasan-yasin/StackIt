import mongoose, { Schema, Document } from 'mongoose';

export type FileType = 'note' | 'image' | 'pdf' | 'link';

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  type: FileType;
  name: string;
  content?: string;
  url?: string;
  filePath?: string;
  size: number;
  folderId?: mongoose.Types.ObjectId;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['note', 'image', 'pdf', 'link'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    filePath: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for better query performance
fileSchema.index({ userId: 1, folderId: 1 });
fileSchema.index({ userId: 1, type: 1 });
fileSchema.index({ userId: 1, isFavorite: 1 });

const File = mongoose.model<IFile>('File', fileSchema);

export default File;
