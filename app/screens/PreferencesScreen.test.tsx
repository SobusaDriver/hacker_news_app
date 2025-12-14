import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { PreferencesScreen } from "./PreferencesScreen"
import { useAppStore } from "../store/useAppStore"
import { ThemeProvider } from "../theme/context"

jest.mock("../store/useAppStore")

describe("PreferencesScreen", () => {
  const mockSetPreferences = jest.fn()
  const mockSetOfflineStatus = jest.fn()

  const mockStore = {
    preferences: { keywords: ["mobile"], notificationsEnabled: true },
    setPreferences: mockSetPreferences,
    articles: [],
    favorites: [],
    deletedIds: [],
    setOfflineStatus: mockSetOfflineStatus,
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

  it("renders correctly", () => {
    const { getByText } = render(<PreferencesScreen {...({} as any)} />, { wrapper })
    expect(getByText("Preferences")).toBeTruthy()
    expect(getByText("Notifications")).toBeTruthy()
  })

  // Test toggle?
})
