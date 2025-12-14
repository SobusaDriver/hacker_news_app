import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import { SwipeableArticleCard } from "./SwipeableArticleCard"
import { ThemeProvider } from "../theme/context"

// Mock ReanimatedSwipeable to avoid gesture handler issues in tests
// unless we set up detailed gesture mocks.
// Simplest way is to mock it to render children and just test the main content.
// Interaction tests for swipe might require integration tests or complex mocks.
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: (props: any) => {
      // Expose props for testing if needed, or simply render children
      return <View {...props} testID="reanimated-swipeable">{props.children}</View>
    },
    SwipeDirection: { LEFT: 1, RIGHT: 2 },
  }
})

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View")
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  }
})

describe("SwipeableArticleCard", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  const mockArticle = {
    objectID: "1",
    title: "Test Article",
    story_title: "Test Story Title",
    author: "testuser",
    created_at: "2023-01-01T00:00:00Z",
    url: "https://example.com",
    points: 100,
    story_text: "",
    comment_text: "",
    num_comments: 10,
    story_id: 1,
    story_url: "https://example.com",
    parent_id: 0,
    created_at_i: 1234567890,
    _tags: [],
    updated_at: "",
  }

  it("renders correctly with article data", () => {
    const { getByText } = render(
      <SwipeableArticleCard article={mockArticle} onPress={() => { }} />,
      { wrapper },
    )
    expect(getByText("Test Story Title")).toBeTruthy()
    expect(getByText(/testuser/)).toBeTruthy()
  })

  it("calls onPress when clicked", () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <SwipeableArticleCard article={mockArticle} onPress={onPressMock} />,
      { wrapper },
    )
    fireEvent.press(getByText("Test Story Title"))
    expect(onPressMock).toHaveBeenCalledWith(mockArticle)
  })

  it("calls onSwipeLeft when swiped left", () => {
    const onSwipeLeftMock = jest.fn()
    const { getByTestId } = render(
      <SwipeableArticleCard
        article={mockArticle}
        onPress={() => { }}
        onSwipeLeft={onSwipeLeftMock}
      />,
      { wrapper },
    )

    const swipeable = getByTestId("reanimated-swipeable")
    // Manually trigger the prop
    // The mock passes props to View, so we can access them
    // Note: in the real component, this is passed to ReanimatedSwipeable
    // In our mock, 'onSwipeableOpen' is passed to the View which might not be a valid View prop but it's fine for testing if we just access props

    // However, View doesn't have onSwipeableOpen in types, so we might need to cast or find another way
    // Better way: Mock implementation calls the callback on render or exposing it via a test helper? 
    // Or we simply invoke the prop directly using rntl

    // Since we spread props in the mock: <View {...props} ...
    // We can fire the event if we knew the prop name mapping, but it's a structural prop

    // Let's grab the instance or props
    const props = swipeable.props
    // The real component passes onSwipeableOpen to ReanimatedSwipeable
    if (props.onSwipeableOpen) {
      props.onSwipeableOpen(1) // SwipeDirection.LEFT = 1
    }

    expect(onSwipeLeftMock).toHaveBeenCalledWith(mockArticle)
  })

  it("calls onSwipeRight when swiped right", () => {
    const onSwipeRightMock = jest.fn()
    const { getByTestId } = render(
      <SwipeableArticleCard
        article={mockArticle}
        onPress={() => { }}
        onSwipeRight={onSwipeRightMock}
      />,
      { wrapper },
    )

    const swipeable = getByTestId("reanimated-swipeable")
    const props = swipeable.props
    if (props.onSwipeableOpen) {
      props.onSwipeableOpen(2) // SwipeDirection.RIGHT = 2
    }

    expect(onSwipeRightMock).toHaveBeenCalledWith(mockArticle)
  })

  it("renders right actions correctly", () => {
    // This is passed to renderRightActions prop of ReanimatedSwipeable
    const { getByTestId } = render(
      <SwipeableArticleCard
        article={mockArticle}
        onPress={() => { }}
        onSwipeLeft={() => { }}
        rightActionLabel="Delete"
      />,
      { wrapper },
    )

    const swipeable = getByTestId("reanimated-swipeable")
    const props = swipeable.props
    // We want to verify renderRightActions is passed and returns correct element
    expect(props.renderRightActions).toBeDefined()

    const RightActions = props.renderRightActions
    const { getByText } = render(<RightActions />, { wrapper })
    expect(getByText("Delete")).toBeTruthy()
  })
})
