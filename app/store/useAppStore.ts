import { create } from "zustand"
import { createJSONStorage, persist, StateStorage } from "zustand/middleware"

import { HnArticle } from "../services/api/hnTypes"
import { storage } from "../utils/storage"

// Defines the storage adapter for Request MMKV
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value)
  },
  getItem: (name) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return storage.delete(name)
  },
}

export interface UserPreferences {
  keywords: string[] // e.g. ['mobile', 'android', 'ios']
  notificationsEnabled: boolean
}

interface AppState {
  articles: HnArticle[]
  favorites: HnArticle[]
  deletedIds: string[]
  isOffline: boolean
  preferences: UserPreferences

  // Actions
  setArticles: (articles: HnArticle[]) => void
  addFavorite: (article: HnArticle) => void
  removeFavorite: (articleId: string) => void
  deleteArticle: (articleId: string) => void
  restoreArticle: (articleId: string) => void
  setPreferences: (prefs: Partial<UserPreferences>) => void
  setOfflineStatus: (isOffline: boolean) => void
  clearDeletedArticles: () => void
  clearCachedArticles: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      articles: [],
      favorites: [],
      deletedIds: [],
      isOffline: false,
      preferences: {
        keywords: ["mobile", "android", "ios"],
        notificationsEnabled: true,
      },

      setArticles: (articles) => set({ articles }),

      addFavorite: (article) =>
        set((state) => ({
          favorites: [...state.favorites, article],
        })),

      removeFavorite: (articleId) =>
        set((state) => ({
          favorites: state.favorites.filter((a) => a.objectID !== articleId),
        })),

      deleteArticle: (articleId) =>
        set((state) => ({
          deletedIds: [...state.deletedIds, articleId],
        })),

      restoreArticle: (articleId) =>
        set((state) => ({
          deletedIds: state.deletedIds.filter((id) => id !== articleId),
        })),

      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      setOfflineStatus: (isOffline) => set({ isOffline }),

      clearDeletedArticles: () => set({ deletedIds: [] }),

      clearCachedArticles: () => set({ articles: [] }),
    }),
    {
      name: "hacker-news-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        articles: state.articles, // Persist articles for offline access
        favorites: state.favorites,
        deletedIds: state.deletedIds,
        preferences: state.preferences,
      }),
    },
  ),
)
