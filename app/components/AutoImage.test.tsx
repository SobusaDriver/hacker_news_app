import { render, renderHook, waitFor } from "@testing-library/react-native"
import { Image } from "react-native"
import React from "react"

import { AutoImage, useAutoImage } from "./AutoImage"

describe("AutoImage", () => {
  describe("useAutoImage hook", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should return [0, 0] initially", () => {
      const { result } = renderHook(() => useAutoImage("https://example.com/image.png"))
      expect(result.current).toEqual([0, 0])
    })

    it("should call Image.getSize and update dimensions", async () => {
      const mockGetSize = Image.getSize as jest.Mock
      mockGetSize.mockImplementation((uri, success) => success(100, 200))

      const { result } = renderHook(() => useAutoImage("https://example.com/image.png"))

      await waitFor(() => expect(result.current).toEqual([100, 200]))
      expect(mockGetSize).toHaveBeenCalledWith("https://example.com/image.png", expect.any(Function))
    })

    it("should call Image.getSizeWithHeaders when headers are provided", async () => {
      const mockGetSizeWithHeaders = Image.getSizeWithHeaders as jest.Mock
      mockGetSizeWithHeaders.mockImplementation((uri, headers, success) => success(100, 200))

      const headers = { Authorization: "Bearer token" }
      const { result } = renderHook(() =>
        useAutoImage("https://example.com/image.png", headers),
      )

      await waitFor(() => expect(result.current).toEqual([100, 200]))
      expect(mockGetSizeWithHeaders).toHaveBeenCalledWith(
        "https://example.com/image.png",
        { Authorization: "Bearer token" },
        expect.any(Function),
      )
    })

    it("should calculate dimensions with maxWidth", async () => {
      const mockGetSize = Image.getSize as jest.Mock
      mockGetSize.mockImplementation((uri, success) => success(200, 100)) // 2:1 aspect ratio

      const { result } = renderHook(() =>
        useAutoImage("https://example.com/image.png", undefined, [100, undefined]),
      )

      await waitFor(() => expect(result.current).toEqual([100, 50]))
    })

    it("should calculate dimensions with maxHeight", async () => {
      const mockGetSize = Image.getSize as jest.Mock
      mockGetSize.mockImplementation((uri, success) => success(200, 100)) // 2:1 aspect ratio

      const { result } = renderHook(() =>
        useAutoImage("https://example.com/image.png", undefined, [undefined, 50]),
      )

      await waitFor(() => expect(result.current).toEqual([100, 50]))
    })

    it("should calculate dimensions with both maxWidth and maxHeight (constrain width)", async () => {
      const mockGetSize = Image.getSize as jest.Mock
      mockGetSize.mockImplementation((uri, success) => success(200, 100)) // 2:1

      const { result } = renderHook(() =>
        useAutoImage("https://example.com/image.png", undefined, [100, 100]),
      )

      await waitFor(() => expect(result.current).toEqual([100, 50]))
    })

    it("should calculate dimensions with both maxWidth and maxHeight (constrain height)", async () => {
      const mockGetSize = Image.getSize as jest.Mock
      mockGetSize.mockImplementation((uri, success) => success(100, 200)) // 1:2

      const { result } = renderHook(() =>
        useAutoImage("https://example.com/image.png", undefined, [100, 100]),
      )

      await waitFor(() => expect(result.current).toEqual([50, 100]))
    })
  })

  describe("AutoImage component", () => {
    it("renders correctly with source", () => {
      const { getByTestId } = render(
        <AutoImage source={{ uri: "https://example.com/image.png" }} testID="auto-image" />,
      )
      expect(getByTestId("auto-image")).toBeTruthy()
    })

    it("applies styles", () => {
      const { getByTestId } = render(
        <AutoImage
          source={{ uri: "https://example.com/image.png" }}
          style={{ borderWidth: 1 }}
          testID="auto-image"
        />,
      )
      const image = getByTestId("auto-image")
      expect(image.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ borderWidth: 1 })]),
      )
    })

    it("passes headers to useAutoImage", async () => {
      const mockGetSizeWithHeaders = Image.getSizeWithHeaders as jest.Mock
      mockGetSizeWithHeaders.mockImplementation((uri, headers, success) => success(100, 100))

      render(
        <AutoImage
          source={{ uri: "https://example.com/image.png", headers: { Auth: "Token" } }}
          testID="auto-image"
        />,
      )

      await waitFor(() =>
        expect(mockGetSizeWithHeaders).toHaveBeenCalledWith(
          "https://example.com/image.png",
          { Auth: "Token" },
          expect.any(Function),
        ),
      )
    })
  })
})
