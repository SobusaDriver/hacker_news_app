import { Linking } from "react-native"

import { openLinkInBrowser } from "./openLinkInBrowser"

describe("openLinkInBrowser", () => {
  it("opens the link using Linking.openURL if canOpenURL returns true", async () => {
    const canOpenSpy = jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true)
    const openSpy = jest.spyOn(Linking, "openURL").mockResolvedValue(true)
    const url = "https://example.com"

    await openLinkInBrowser(url)

    expect(canOpenSpy).toHaveBeenCalledWith(url)
    // Wait for promise chain resolution in implementation
    await new Promise(process.nextTick)
    expect(openSpy).toHaveBeenCalledWith(url)

    canOpenSpy.mockRestore()
    openSpy.mockRestore()
  })

  it("does not open the link if canOpenURL returns false", async () => {
    const canOpenSpy = jest.spyOn(Linking, "canOpenURL").mockResolvedValue(false)
    const openSpy = jest.spyOn(Linking, "openURL").mockResolvedValue(true)
    const url = "https://example.com"

    await openLinkInBrowser(url)

    expect(canOpenSpy).toHaveBeenCalledWith(url)
    await new Promise(process.nextTick)
    expect(openSpy).not.toHaveBeenCalled()

    canOpenSpy.mockRestore()
    openSpy.mockRestore()
  })
})
