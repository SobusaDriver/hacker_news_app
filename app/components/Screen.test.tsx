import React from "react"
import { Text, View } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Screen } from "./Screen"
import { ThemeProvider } from "../theme/context"

// Mock useSafeAreaInsetsStyle
jest.mock("@/utils/useSafeAreaInsetsStyle", () => ({
  useSafeAreaInsetsStyle: jest.fn().mockReturnValue({ paddingTop: 10, paddingBottom: 10 }),
  ExtendedEdge: ["top", "bottom"],
}))

// Mock SystemBars
jest.mock("react-native-edge-to-edge", () => ({
  SystemBars: () => null,
}))

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useScrollToTop: jest.fn(),
}))

// Mock KeyboardAwareScrollView to render a simple ScrollView
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: ({ children, testID, scrollEnabled, onLayout, onContentSizeChange, ...props }: any) => {
    const { ScrollView } = require("react-native")
    return (
      <ScrollView
        testID={testID}
        scrollEnabled={scrollEnabled}
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        {...props}
      >
        {children}
      </ScrollView>
    )
  },
}))

describe("Screen", () => {
  // Provide initialMetrics to SafeAreaProvider to ensure children render
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 375, height: 812 },
        insets: { top: 44, left: 0, right: 0, bottom: 34 },
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders children correctly", () => {
    const { getByText } = render(
      <Screen>
        <Text>Screen Content</Text>
      </Screen>,
      { wrapper }
    )
    expect(getByText("Screen Content")).toBeTruthy()
  })

  it("renders with scroll preset", () => {
    const { getByTestId, getByText } = render(
      <Screen preset="scroll" testID="my-screen">
        <Text>Scroll Content</Text>
      </Screen>,
      { wrapper }
    )
    expect(getByText("Scroll Content")).toBeTruthy()
    expect(getByTestId("my-screen")).toBeTruthy()
    expect(getByTestId("my-screen-scroll-view")).toBeTruthy()
  })

  it("renders with auto preset and verifies scroll view exists", () => {
    const { getByTestId } = render(
      <Screen preset="auto" testID="auto-screen">
        <View style={{ height: 100 }} />
      </Screen>,
      { wrapper }
    )

    const scrollView = getByTestId("auto-screen-scroll-view")
    expect(scrollView).toBeTruthy()
  })

  it("renders with fixed preset (no scroll view)", () => {
    const { getByText, queryByTestId, getAllByTestId } = render(
      <Screen preset="fixed" testID="fixed-screen">
        <Text>Fixed Content</Text>
      </Screen>,
      { wrapper }
    )
    expect(getByText("Fixed Content")).toBeTruthy()
    // Fixed preset should NOT have a scroll view
    expect(queryByTestId("fixed-screen-scroll-view")).toBeNull()
    // Multiple elements may have the testID (outer screen + inner view)
    const screens = getAllByTestId("fixed-screen")
    expect(screens.length).toBeGreaterThan(0)
  })

  it("applies background color", () => {
    const { getAllByTestId } = render(
      <Screen testID="bg-screen" backgroundColor="blue" />,
      { wrapper }
    )
    const screens = getAllByTestId("bg-screen")
    // Verify at least one screen view exists with the testID
    expect(screens.length).toBeGreaterThan(0)
  })

  it("handles keyboardOffset prop", () => {
    const { getByTestId } = render(
      <Screen testID="keyboard-screen" keyboardOffset={50}>
        <Text>With Keyboard Offset</Text>
      </Screen>,
      { wrapper }
    )
    const kavView = getByTestId("keyboard-screen-keyboard-avoiding-view")
    expect(kavView).toBeTruthy()
  })

  it("auto preset toggles scrollEnabled based on content size", () => {
    const { getByTestId, rerender } = render(
      <Screen preset="auto" testID="auto-toggle-screen">
        <View style={{ height: 100 }} />
      </Screen>,
      { wrapper }
    )

    const scrollView = getByTestId("auto-toggle-screen-scroll-view")

    // Simulate layout (screen height 800)
    fireEvent(scrollView, "layout", {
      nativeEvent: { layout: { height: 800 } },
    })

    // Content fits: 200 < 800 * 0.92 = 736 -> scrollEnabled should be false
    fireEvent(scrollView, "contentSizeChange", 320, 200)
    expect(scrollView.props.scrollEnabled).toBe(false)

    // Content overflows: 800 > 736 -> scrollEnabled should be true
    fireEvent(scrollView, "contentSizeChange", 320, 800)
    expect(scrollView.props.scrollEnabled).toBe(true)
  })

  it("auto preset uses point threshold when provided", () => {
    const { getByTestId } = render(
      <Screen
        preset="auto"
        testID="point-screen"
        scrollEnabledToggleThreshold={{ point: 100 }}
      >
        <View style={{ height: 100 }} />
      </Screen>,
      { wrapper }
    )

    const scrollView = getByTestId("point-screen-scroll-view")

    // Simulate layout (screen height 500)
    fireEvent(scrollView, "layout", {
      nativeEvent: { layout: { height: 500 } },
    })

    // Content fits with point threshold: 350 < 500 - 100 = 400 -> scrollEnabled = false
    fireEvent(scrollView, "contentSizeChange", 320, 350)
    expect(scrollView.props.scrollEnabled).toBe(false)

    // Content exceeds: 450 > 400 -> scrollEnabled = true
    fireEvent(scrollView, "contentSizeChange", 320, 450)
    expect(scrollView.props.scrollEnabled).toBe(true)
  })

  it("forwards ScrollViewProps callbacks", () => {
    const onLayoutMock = jest.fn()
    const onContentSizeChangeMock = jest.fn()

    const { getByTestId } = render(
      <Screen
        preset="scroll"
        testID="forward-screen"
        ScrollViewProps={{
          onLayout: onLayoutMock,
          onContentSizeChange: onContentSizeChangeMock,
        }}
      >
        <Text>Content</Text>
      </Screen>,
      { wrapper }
    )

    const scrollView = getByTestId("forward-screen-scroll-view")

    fireEvent(scrollView, "layout", {
      nativeEvent: { layout: { height: 500 } },
    })
    expect(onLayoutMock).toHaveBeenCalled()

    fireEvent(scrollView, "contentSizeChange", 320, 200)
    expect(onContentSizeChangeMock).toHaveBeenCalledWith(320, 200)
  })
})
