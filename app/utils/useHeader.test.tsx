import { renderHook } from "@testing-library/react-native"
import { useHeader } from "./useHeader"
import React from "react"
import { Text } from "react-native"
import { useNavigation } from "@react-navigation/native"

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}))

jest.mock("@/components/Header", () => {
    const { Text } = require("react-native")
    const React = require("react")
    return {
        Header: (props: any) => <Text>{JSON.stringify(props)}</Text>
    }
})

describe("useHeader", () => {
    const mockSetOptions = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useNavigation as jest.Mock).mockReturnValue({
                setOptions: mockSetOptions,
            })
    })

    it("should set header options on mount", () => {
        const headerProps = { title: "Test Title" }
        renderHook(() => useHeader(headerProps))

        expect(mockSetOptions).toHaveBeenCalledWith(
            expect.objectContaining({
                headerShown: true,
                header: expect.any(Function),
            })
        )

        // Verify the header function returns the Mocked Header with props
        const options = mockSetOptions.mock.calls[0][0]
        const headerElement = options.header()
        // headerElement is <Header ... /> so we check its props
        expect(headerElement.props).toEqual(expect.objectContaining({ title: "Test Title" }))
    })

    it("should update options when deps change", () => {
        const { rerender } = renderHook(
            ({ title }: { title: string }) => useHeader({ title }, [title]),
            { initialProps: { title: "Initial" } }
        )

        expect(mockSetOptions).toHaveBeenCalledTimes(1)
        expect(mockSetOptions).toHaveBeenLastCalledWith(expect.objectContaining({
            header: expect.any(Function)
        }))
        const initialHeader = mockSetOptions.mock.calls[0][0].header()
        expect(initialHeader.props).toEqual(expect.objectContaining({ title: "Initial" }))

        // Rerender with new title
        rerender({ title: "Updated" })

        expect(mockSetOptions).toHaveBeenCalledTimes(2)
        const updatedHeader = mockSetOptions.mock.calls[1][0].header()
        expect(updatedHeader.props).toEqual(expect.objectContaining({ title: "Updated" }))
    })
})
