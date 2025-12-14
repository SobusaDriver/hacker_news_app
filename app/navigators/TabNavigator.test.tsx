import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { TabNavigator } from "./TabNavigator"
import { useAppStore } from "../store/useAppStore"
import { ThemeProvider } from "../theme/context"

// Mock screens to avoid complex rendering
jest.mock("../screens/HomeScreen", () => ({ HomeScreen: () => <></> }))
jest.mock("../screens/PreferencesScreen", () => ({ PreferencesScreen: () => <></> }))
jest.mock("../screens/DeletedScreen", () => ({ DeletedScreen: () => <></> }))
jest.mock("../store/useAppStore", () => ({ useAppStore: jest.fn(() => ({})) }))

describe("TabNavigator", () => {
  it("renders without crashing", () => {
    // Just smoke test
    render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <ThemeProvider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>,
    )
  })
})
