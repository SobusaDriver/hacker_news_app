import { jest } from "@jest/globals"

// Mock react-native to fix Image component issue
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native") as any

  // Override Image
  RN.Image = (props: any) => {
    const React = require("react")
    return React.createElement("Image", props, props.children)
  }
  RN.Image.displayName = "Image"
  RN.Image.getSize = jest.fn()
  RN.Image.getSizeWithHeaders = jest.fn()
  RN.Image.prefetch = jest.fn()
  RN.Image.resolveAssetSource = jest.fn((source: any) => source)

  return RN
})

jest.mock("react-native-keyboard-controller", () =>
  require("react-native-keyboard-controller/jest"),
)

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useScrollToTop: jest.fn(),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      dispatch: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
    useFocusEffect: jest.fn((callback) => callback()),
  }
})

// Mock Expo modules
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}))

jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn().mockResolvedValue(false),
  unregisterTaskAsync: jest.fn(),
}))

jest.mock("expo-background-task", () => ({
  registerTaskAsync: jest.fn(),
  unregisterTaskAsync: jest.fn(),
  BackgroundTaskResult: {
    Success: "success",
    Failed: "failed",
  },
}))

jest.mock("react-native-webview", () => ({
  WebView: (props: any) => {
    const { View } = require("react-native")
    const React = require("react")
    return React.createElement(View, props)
  },
}))
