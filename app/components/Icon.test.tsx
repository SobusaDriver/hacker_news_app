import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import { Icon, PressableIcon } from "./Icon"
import { ThemeProvider } from "../theme/context"

describe("Icon", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  it("renders correctly with valid icon name", () => {
    const { getByTestId } = render(<Icon icon="back" testID="icon-back" />, { wrapper })
    expect(getByTestId("icon-back")).toBeTruthy()
  })

  it("handles press events when onPress is provided", () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <PressableIcon icon="back" onPress={onPressMock} testID="pressable-icon" />,
      { wrapper },
    )
    fireEvent.press(getByTestId("pressable-icon"))
    expect(onPressMock).toHaveBeenCalled()
  })
})
