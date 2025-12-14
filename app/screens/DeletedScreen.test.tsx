import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { DeletedScreen } from "./DeletedScreen"
import { useAppStore } from "../store/useAppStore"
import { ThemeProvider } from "../theme/context"

jest.mock("../store/useAppStore")

describe("DeletedScreen", () => {
  const mockRestoreArticle = jest.fn()

  // Default store state
  const mockStore = {
    articles: [{ objectID: "1", title: "Deleted Article", author: "me" }],
    favorites: [],
    deletedIds: ["1"],
    restoreArticle: mockRestoreArticle,
  }

  beforeEach(() => {
    ;(useAppStore as unknown as jest.Mock).mockReturnValue(mockStore)
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

  it("renders deleted articles", () => {
    const { getByText } = render(<DeletedScreen {...({} as any)} />, { wrapper })
    expect(getByText("Deleted Article")).toBeTruthy()
  })

  it("shows empty state when no deleted articles", () => {
    ;(useAppStore as unknown as jest.Mock).mockReturnValue({
      ...mockStore,
      deletedIds: [],
    })
    const { getByText } = render(<DeletedScreen {...({} as any)} />, { wrapper })
    expect(getByText("No deleted articles found in current feed")).toBeTruthy()
  })
})
