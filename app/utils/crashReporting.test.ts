import { initCrashReporting, reportCrash, ErrorType } from "./crashReporting"

describe("crashReporting", () => {
  const originalDev = __DEV__
  const originalConsoleError = console.error
  const originalConsoleLog = console.log

  beforeEach(() => {
    console.error = jest.fn()
    console.log = jest.fn()
  })

  afterEach(() => {
    // @ts-ignore
    global.__DEV__ = originalDev
    console.error = originalConsoleError
    console.log = originalConsoleLog
  })

  it("initCrashReporting does not throw", () => {
    expect(() => initCrashReporting()).not.toThrow()
  })

  it("reports crash to console in DEV", () => {
    // @ts-ignore
    global.__DEV__ = true
    const error = new Error("Test Error")
    reportCrash(error)
    expect(console.error).toHaveBeenCalledWith(error)
    expect(console.log).toHaveBeenCalledWith("Test Error", ErrorType.FATAL)
  })

  it("reports handled error to console in DEV", () => {
    // @ts-ignore
    global.__DEV__ = true
    const error = new Error("Handled Error")
    reportCrash(error, ErrorType.HANDLED)
    expect(console.error).toHaveBeenCalledWith(error)
    expect(console.log).toHaveBeenCalledWith("Handled Error", ErrorType.HANDLED)
  })

  it("does not log to console in PROD", () => {
    // @ts-ignore
    global.__DEV__ = false
    const error = new Error("Prod Error")
    reportCrash(error)
    expect(console.error).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
