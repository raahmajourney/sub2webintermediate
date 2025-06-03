import { openDB } from 'idb';

const DB_NAME = 'story-favorite-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const FavoriteDB = {
  async addStory(story) {
    const db = await dbPromise;
    await db.put(STORE_NAME, story);
  },

  async getStory(id) {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },
};

export default FavoriteDB;
