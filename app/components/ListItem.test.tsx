import React from "react"
import { Text } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"

import { ListItem } from "./ListItem"
import { ThemeProvider } from "../theme/context"

describe("ListItem", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  it("renders correctly with text", () => {
    const { getByText } = render(<ListItem text="Item Title" />, { wrapper })
    expect(getByText("Item Title")).toBeTruthy()
  })

  it("renders custom components", () => {
    const { getByText } = render(
      <ListItem LeftComponent={<Text>Left</Text>} RightComponent={<Text>Right</Text>} />,
      { wrapper },
    )
    expect(getByText("Left")).toBeTruthy()
    expect(getByText("Right")).toBeTruthy()
  })

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn()
    const { getByText } = render(<ListItem text="Pressable Item" onPress={onPressMock} />, {
      wrapper,
    })
    fireEvent.press(getByText("Pressable Item"))
    expect(onPressMock).toHaveBeenCalled()
  })
})
