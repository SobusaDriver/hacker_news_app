import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { AppNavigator } from "./AppNavigator"
import { ThemeProvider } from "../theme/context"

// Mock screens
jest.mock("../screens/HomeScreen", () => ({ HomeScreen: () => <></> }))
jest.mock("../screens/PreferencesScreen", () => ({ PreferencesScreen: () => <></> }))
jest.mock("../screens/DeletedScreen", () => ({ DeletedScreen: () => <></> }))
jest.mock("../screens/ArticleDetailScreen", () => ({ ArticleDetailScreen: () => <></> }))
jest.mock("../navigators/TabNavigator", () => ({ TabNavigator: () => <></> })) // If AppNavigator uses TabNavigator

describe("AppNavigator", () => {
  it("renders without crashing", () => {
    render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 0, height: 0 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <ThemeProvider>
          {/* AppNavigator already includes NavigationContainer */}
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>,
    )
  })
})
