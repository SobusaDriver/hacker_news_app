import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"

import { EmptyState } from "./EmptyState"
import { ThemeProvider } from "../theme/context"

// Mock AutoImage since it might use sizing logic we don't need to test here,
// or let it run if it's safe.
// Adding NavigationContainer because some components might depend on it implicitly
// (though EmptyState doesn't seem to, but it's safe).

describe("EmptyState", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </ThemeProvider>
  )

  it("renders correctly with heading and content", () => {
    const { getByText } = render(<EmptyState heading="No Data" content="Try refreshing" />, {
      wrapper,
    })
    expect(getByText("No Data")).toBeTruthy()
    expect(getByText("Try refreshing")).toBeTruthy()
  })

  it("renders button and handles press", () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <EmptyState heading="Empty" button="Retry" buttonOnPress={onPressMock} />,
      { wrapper },
    )
    fireEvent.press(getByText("Retry"))
    expect(onPressMock).toHaveBeenCalled()
  })
})
