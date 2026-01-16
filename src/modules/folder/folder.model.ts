import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  parentId?: mongoose.Types.ObjectId; // For nested folders
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for better query performance
folderSchema.index({ userId: 1, parentId: 1 });

const Folder = mongoose.model<IFolder>('Folder', folderSchema);

export default Folder;
