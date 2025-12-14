import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import { Button } from "./Button"
import { ThemeProvider } from "../theme/context"

describe("Button", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  it("renders correctly with text", () => {
    const { getByText } = render(<Button text="Click me" />, { wrapper })
    expect(getByText("Click me")).toBeTruthy()
  })

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn()
    const { getByText } = render(<Button text="Press me" onPress={onPressMock} />, { wrapper })
    fireEvent.press(getByText("Press me"))
    expect(onPressMock).toHaveBeenCalled()
  })

  it("renders disabled state correctly", () => {
    const onPressMock = jest.fn()
    const { getByText } = render(<Button text="Disabled" disabled onPress={onPressMock} />, {
      wrapper,
    })
    fireEvent.press(getByText("Disabled"))
    expect(onPressMock).not.toHaveBeenCalled()
  })
})
