import React from "react"
import { Text, View } from "react-native"
import { render, renderHook, act } from "@testing-library/react-native"
import { ThemeProvider, useAppTheme } from "./context"

// Mock MMKV
jest.mock("react-native-mmkv", () => ({
    useMMKVString: jest.fn(),
}))

// Mock storage
jest.mock("@/utils/storage", () => ({
    storage: {},
}))

describe("ThemeContext", () => {
    const { useMMKVString } = require("react-native-mmkv")

    beforeEach(() => {
        useMMKVString.mockReturnValue([undefined, jest.fn()])
    })

    it("renders children", () => {
        const { getByText } = render(
            <ThemeProvider>
                <Text>Child Content</Text>
            </ThemeProvider>
        )
        expect(getByText("Child Content")).toBeTruthy()
    })

    it("provides default theme (light)", () => {
        const { result } = renderHook(() => useAppTheme(), {
            wrapper: ThemeProvider
        })
        expect(result.current.themeContext).toBe("light")
        expect(result.current.theme).toBeDefined()
    })

    it("allows overriding theme", () => {
        const setThemeScheme = jest.fn()
        useMMKVString.mockReturnValue(["light", setThemeScheme])

        const { result } = renderHook(() => useAppTheme(), {
            wrapper: ThemeProvider
        })

        act(() => {
            result.current.setThemeContextOverride("dark")
        })

        expect(setThemeScheme).toHaveBeenCalledWith("dark")
    })

    it("returns correct theme based on context", () => {
        useMMKVString.mockReturnValue(["dark", jest.fn()])
        const { result } = renderHook(() => useAppTheme(), {
            wrapper: ThemeProvider
        })
        expect(result.current.themeContext).toBe("dark")
    })
})
