import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getGameById } from '../data/games';

type FavoritesState = {
  favoriteIds: string[];
  hasHydrated: boolean;
  hydrationError: boolean;
  persistenceError: boolean;
  toggleFavorite: (id: string) => void;
  finishHydration: (succeeded: boolean) => void;
  setPersistenceError: (failed: boolean) => void;
};

// These transient status updates use Zustand's normal setter, which persist
// also observes. Skip their corresponding storage write so an error or
// hydration callback can never replace saved IDs with initial empty state.
let skipNextStorageWrite = false;
let writeQueue = Promise.resolve();

const storage = createJSONStorage(() => ({
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: async (name, value) => {
    if (skipNextStorageWrite) {
      skipNextStorageWrite = false;
      return;
    }

    writeQueue = writeQueue.then(async () => {
      try {
        await AsyncStorage.setItem(name, value);
        useFavoritesStore.getState().setPersistenceError(false);
      } catch {
        useFavoritesStore.getState().setPersistenceError(true);
        console.warn('Could not save favorites to storage.');
      }
    });
    await writeQueue;
  },
  removeItem: (name) => AsyncStorage.removeItem(name),
}));

export const useFavoritesStore = create<FavoritesState>()(persist(
  (set, get) => ({
    favoriteIds: [],
    hasHydrated: false,
    hydrationError: false,
    persistenceError: false,
    finishHydration: (succeeded) => {
      skipNextStorageWrite = true;
      set({ hasHydrated: true, hydrationError: !succeeded });
    },
    setPersistenceError: (failed) => {
      if (get().persistenceError === failed) return;
      skipNextStorageWrite = true;
      set({ persistenceError: failed });
    },
    toggleFavorite: (id) => {
      const state = get();
      if (!state.hasHydrated || state.hydrationError || !getGameById(id)) return;

      set((current) => ({
        favoriteIds: current.favoriteIds.includes(id)
          ? current.favoriteIds.filter((favoriteId) => favoriteId !== id)
          : [...current.favoriteIds, id],
      }));
    },
  }),
  {
    name: 'gamehub-favorites',
    storage,
    partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    merge: (persistedState, currentState) => {
      const savedIds = (persistedState as { favoriteIds?: unknown } | undefined)?.favoriteIds;
      const favoriteIds = Array.isArray(savedIds)
        ? [...new Set(savedIds.filter((id): id is string => typeof id === 'string' && !!getGameById(id)))]
        : [];

      return { ...currentState, favoriteIds };
    },
    onRehydrateStorage: () => (_state, error) => {
      useFavoritesStore.getState().finishHydration(!error);
      if (error) console.warn('Could not load saved favorites from storage.');
    },
  },
));
