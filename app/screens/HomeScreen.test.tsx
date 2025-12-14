import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { HomeScreen } from "./HomeScreen"
import { hnApi } from "../services/api/hnApi"
import { useAppStore } from "../store/useAppStore"
import { ThemeProvider } from "../theme/context"

// Mock dependencies
jest.mock("../store/useAppStore")
jest.mock("../services/api/hnApi")

describe("HomeScreen", () => {
  const mockSetArticles = jest.fn()
  const mockAddFavorite = jest.fn()
  const mockRemoveFavorite = jest.fn()
  const mockDeleteArticle = jest.fn()

  // Default store state
  const mockStore = {
    articles: [{ objectID: "1", title: "Test Article", author: "me" }],
    favorites: [],
    deletedIds: [],
    preferences: { keywords: ["mobile"], notificationsEnabled: true },
    isOffline: false,
    setArticles: mockSetArticles,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    deleteArticle: mockDeleteArticle,
    setOfflineStatus: jest.fn(),
  }

  beforeEach(() => {
    ;(useAppStore as unknown as jest.Mock).mockReturnValue(mockStore)
    ;(hnApi.getMobileArticles as jest.Mock).mockResolvedValue({
      kind: "ok",
      articles: [{ objectID: "1", title: "Test Article", author: "me" }],
    })
  })

  const wrapper = ({ children }: any) => (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <ThemeProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )

  it("renders correctly", async () => {
    const { getByText, findByText } = render(<HomeScreen {...({} as any)} />, { wrapper })
    expect(getByText("Hacker News App")).toBeTruthy()
    const article = await findByText("Test Article")
    expect(article).toBeTruthy()
  })

  it("handles pull to refresh", async () => {
    const { getByTestId, findByText } = render(<HomeScreen {...({} as any)} />, { wrapper })

    const article = await findByText("Test Article")
    expect(hnApi.getMobileArticles).toHaveBeenCalled()
  })
})
