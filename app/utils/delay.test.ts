import { delay } from "./delay"

describe("delay", () => {
  it("resolves after the specified time", async () => {
    const start = Date.now()
    await delay(100)
    const end = Date.now()
    // Allow some flexibility for execution time
    expect(end - start).toBeGreaterThanOrEqual(90)
  })

  it("resolves immediately if ms is 0", async () => {
    const start = Date.now()
    await delay(0)
    const end = Date.now()
    expect(end - start).toBeLessThan(50)
  })
})
