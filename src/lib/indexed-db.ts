import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ParentingMealDB extends DBSchema {
  'educational_content': {
    key: string;
    value: {
      id: string;
      title: string;
      content: string;
      category: string;
      tags: string[];
      readTime: number;
      lastAccessed: Date;
    };
  };
  'recipes': {
    key: string;
    value: {
      id: string;
      name: string;
      description?: string;
      ingredients: string[];
      instructions: string[];
      lastAccessed: Date;
    };
  };
  'user_actions': {
    key: string;
    value: {
      id: string;
      action: string;
      data: any;
      timestamp: Date;
      synced: boolean;
    };
  };
}

let dbInstance: IDBPDatabase<ParentingMealDB> | null = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ParentingMealDB>('parenting-meal-db', 1, {
    upgrade(db) {
      // Educational content store
      if (!db.objectStoreNames.contains('educational_content')) {
        const contentStore = db.createObjectStore('educational_content', {
          keyPath: 'id'
        });
        contentStore.createIndex('category', 'category');
        contentStore.createIndex('lastAccessed', 'lastAccessed');
      }

      // Recipes store
      if (!db.objectStoreNames.contains('recipes')) {
        const recipeStore = db.createObjectStore('recipes', {
          keyPath: 'id'
        });
        recipeStore.createIndex('name', 'name');
        recipeStore.createIndex('lastAccessed', 'lastAccessed');
      }

      // User actions store (for offline actions)
      if (!db.objectStoreNames.contains('user_actions')) {
        const actionStore = db.createObjectStore('user_actions', {
          keyPath: 'id'
        });
        actionStore.createIndex('synced', 'synced');
        actionStore.createIndex('timestamp', 'timestamp');
      }
    },
  });

  return dbInstance;
}

// Educational Content Operations
export async function saveEducationalContent(content: ParentingMealDB['educational_content']['value']) {
  const db = await initDB();
  const tx = db.transaction('educational_content', 'readwrite');
  await tx.store.put({
    ...content,
    lastAccessed: new Date()
  });
  await tx.done;
}

export async function getEducationalContent(id: string) {
  const db = await initDB();
  return await db.get('educational_content', id);
}

export async function getAllEducationalContent() {
  const db = await initDB();
  return await db.getAll('educational_content');
}

// Recipe Operations
export async function saveRecipe(recipe: ParentingMealDB['recipes']['value']) {
  const db = await initDB();
  const tx = db.transaction('recipes', 'readwrite');
  await tx.store.put({
    ...recipe,
    lastAccessed: new Date()
  });
  await tx.done;
}

export async function getRecipe(id: string) {
  const db = await initDB();
  return await db.get('recipes', id);
}

export async function getAllRecipes() {
  const db = await initDB();
  return await db.getAll('recipes');
}

// Offline Actions Queue
export async function queueOfflineAction(action: Omit<ParentingMealDB['user_actions']['value'], 'id' | 'synced' | 'timestamp'>) {
  const db = await initDB();
  const tx = db.transaction('user_actions', 'readwrite');
  const id = `action_${Date.now()}_${Math.random()}`;
  await tx.store.put({
    id,
    ...action,
    timestamp: new Date(),
    synced: false
  });
  await tx.done;
  return id;
}

export async function getUnsyncedActions() {
  const db = await initDB();
  return await db.getAllFromIndex('user_actions', 'synced', false);
}

export async function markActionSynced(id: string) {
  const db = await initDB();
  const action = await db.get('user_actions', id);
  if (action) {
    await db.put('user_actions', { ...action, synced: true });
  }
}

// Utility functions
export async function clearOldData() {
  const db = await initDB();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Clear old educational content
  const contentTx = db.transaction('educational_content', 'readwrite');
  const oldContent = await contentTx.store.index('lastAccessed').getAll(IDBKeyRange.upperBound(oneWeekAgo));
  for (const item of oldContent) {
    await contentTx.store.delete(item.id);
  }
  await contentTx.done;

  // Clear old recipes
  const recipeTx = db.transaction('recipes', 'readwrite');
  const oldRecipes = await recipeTx.store.index('lastAccessed').getAll(IDBKeyRange.upperBound(oneWeekAgo));
  for (const item of oldRecipes) {
    await recipeTx.store.delete(item.id);
  }
  await recipeTx.done;
}
