import File, { IFile } from '../file/file.model';

class FavoriteService {
  // Get all favorites for a user
  async getFavorites(userId: string): Promise<IFile[]> {
    const favorites = await File.find({ userId, isFavorite: true }).sort({ createdAt: -1 });
    return favorites;
  }

  // Toggle favorite status
  async toggleFavorite(itemId: string, userId: string): Promise<{ isFavorite: boolean }> {
    const item = await File.findOne({ _id: itemId, userId });

    if (!item) {
      throw new Error('Item not found');
    }

    item.isFavorite = !item.isFavorite;
    await item.save();

    return { isFavorite: item.isFavorite };
  }

  // Mark as favorite
  async addFavorite(itemId: string, userId: string): Promise<IFile> {
    const item = await File.findOne({ _id: itemId, userId });

    if (!item) {
      throw new Error('Item not found');
    }

    item.isFavorite = true;
    await item.save();

    return item;
  }

  // Remove from favorites
  async removeFavorite(itemId: string, userId: string): Promise<IFile> {
    const item = await File.findOne({ _id: itemId, userId });

    if (!item) {
      throw new Error('Item not found');
    }

    item.isFavorite = false;
    await item.save();

    return item;
  }
}

export const favoriteService = new FavoriteService();
