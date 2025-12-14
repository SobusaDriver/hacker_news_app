import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { ArticleDetailScreen } from "./ArticleDetailScreen"
import { ThemeProvider } from "../theme/context"

// Mock route params
jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native")
  return {
    ...actual,
    useRoute: () => ({
      params: { url: "https://example.com", title: "Test Article" },
    }),
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

describe("ArticleDetailScreen", () => {
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

  it("renders webview with correct url", () => {
    const route = { params: { url: "https://example.com", title: "Test Article" } } as any
    const navigation = { setOptions: jest.fn(), goBack: jest.fn() } as any

    const { toJSON } = render(<ArticleDetailScreen route={route} navigation={navigation} />, {
      wrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
