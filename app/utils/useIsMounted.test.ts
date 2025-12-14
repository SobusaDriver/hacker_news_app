import { renderHook } from "@testing-library/react-native"

import { useIsMounted } from "./useIsMounted"

describe("useIsMounted", () => {
  it("returns true when mounted", () => {
    const { result } = renderHook(() => useIsMounted())
    expect(result.current()).toBe(true)
  })

  it("returns false when unmounted", () => {
    const { result, unmount } = renderHook(() => useIsMounted())
    expect(result.current()).toBe(true)
    unmount()
    expect(result.current()).toBe(false)
  })
})
