import { renderHook, act } from "@testing-library/react-native"

import { useAppStore } from "./useAppStore"
import { storage } from "../utils/storage"

// Mock storage
jest.mock("../utils/storage", () => ({
  storage: {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  },
}))

describe("useAppStore", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { result } = renderHook(() => useAppStore())

    // Reset store state
    act(() => {
      result.current.setArticles([])
      result.current.setPreferences({
        keywords: ["mobile", "android", "ios"],
        notificationsEnabled: true,
      })
      // Reset favorites/deleted by direct manipulation if possible or by adding reset action.
      // Since it's persisted, we might need to rely on mocks logic.
      // But zustand `create` with persist...
      // Easier to just test actions incrementally.
    })
  })

  it("sets articles", () => {
    const { result } = renderHook(() => useAppStore())
    const articles: any[] = [{ objectID: "1", title: "Test" }]

    act(() => {
      result.current.setArticles(articles)
    })

    expect(result.current.articles).toEqual(articles)
  })

  it("adds and removes favorite", () => {
    const { result } = renderHook(() => useAppStore())
    const article: any = { objectID: "1", title: "Fav" }

    act(() => {
      result.current.addFavorite(article)
    })
    expect(result.current.favorites).toContainEqual(article)

    act(() => {
      result.current.removeFavorite("1")
    })
    expect(result.current.favorites).not.toContainEqual(article)
  })

  it("deletes and restores article", () => {
    const { result } = renderHook(() => useAppStore())

    act(() => {
      result.current.deleteArticle("1")
    })
    expect(result.current.deletedIds).toContain("1")

    act(() => {
      result.current.restoreArticle("1")
    })
    expect(result.current.deletedIds).not.toContain("1")
  })

  it("sets preferences", () => {
    const { result } = renderHook(() => useAppStore())

    act(() => {
      result.current.setPreferences({ notificationsEnabled: false })
    })
    expect(result.current.preferences.notificationsEnabled).toBe(false)
    expect(result.current.preferences.keywords).toHaveLength(3) // originals
  })

  it("sets offline status", () => {
    const { result } = renderHook(() => useAppStore())

    act(() => {
      result.current.setOfflineStatus(true)
    })
    expect(result.current.isOffline).toBe(true)
  })
})
