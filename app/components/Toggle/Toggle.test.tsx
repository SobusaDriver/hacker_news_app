import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import { Checkbox } from "./Checkbox"
import { Radio } from "./Radio"
import { Switch } from "./Switch"
import { Toggle } from "./Toggle"
import { ThemeProvider } from "../../theme/context"

jest.mock("../Icon", () => ({
  iconRegistry: {
    check: { uri: "check" },
    back: { uri: "back" },
  },
  Icon: "Icon",
}))

describe("Toggle Components", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  describe("Switch", () => {
    it("renders correctly", () => {
      const { getByRole } = render(<Switch value={false} onValueChange={() => {}} />, { wrapper })
      // Switch has accessibilityRole="switch"
      expect(getByRole("switch")).toBeTruthy()
    })

    it("calls onValueChange when pressed", () => {
      const onValueChangeMock = jest.fn()
      const { getByRole } = render(<Switch value={false} onValueChange={onValueChangeMock} />, {
        wrapper,
      })
      fireEvent.press(getByRole("switch"))
      expect(onValueChangeMock).toHaveBeenCalledWith(true)
    })

    it("renders correctly with icon mode", () => {
      const { getByRole } = render(
        <Switch value={false} onValueChange={() => {}} accessibilityMode="icon" />,
        { wrapper },
      )
      expect(getByRole("switch")).toBeTruthy()
    })
  })

  describe("Checkbox", () => {
    it("renders correctly", () => {
      const { getByRole } = render(<Checkbox value={false} onValueChange={() => {}} />, { wrapper })
      expect(getByRole("checkbox")).toBeTruthy()
    })
  })

  describe("Radio", () => {
    it("renders correctly", () => {
      const { getByRole } = render(<Radio value={false} onValueChange={() => {}} />, { wrapper })
      expect(getByRole("radio")).toBeTruthy()
    })
  })
})
