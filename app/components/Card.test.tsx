import React from "react"
import { Text, View } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"

import { Card } from "./Card"
import { ThemeProvider } from "../theme/context"

describe("Card", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  it("renders correctly with heading and content", () => {
    const { getByText } = render(<Card heading="Test Heading" content="Test Content" />, {
      wrapper,
    })
    expect(getByText("Test Heading")).toBeTruthy()
    expect(getByText("Test Content")).toBeTruthy()
  })

  it("renders custom components in slots", () => {
    const { getByText } = render(
      <Card
        LeftComponent={<Text>Left</Text>}
        RightComponent={<Text>Right</Text>}
        FooterComponent={<Text>Footer</Text>}
      />,
      { wrapper },
    )
    expect(getByText("Left")).toBeTruthy()
    expect(getByText("Right")).toBeTruthy()
    expect(getByText("Footer")).toBeTruthy()
  })

  it("calls onPress when pressable", () => {
    const onPressMock = jest.fn()
    const { getByText } = render(<Card heading="Pressable Card" onPress={onPressMock} />, {
      wrapper,
    })
    fireEvent.press(getByText("Pressable Card"))
    expect(onPressMock).toHaveBeenCalled()
  })
})
