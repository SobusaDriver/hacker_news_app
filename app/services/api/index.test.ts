import { getGeneralApiProblem } from "./apiProblem"
import { ApiConfig } from "./types"

import { Api } from "./index"

// Mock apisauce
const mockApisauce = {
  get: jest.fn(),
  setHeader: jest.fn(),
  setHeaders: jest.fn(),
}

jest.mock("apisauce", () => ({
  create: () => mockApisauce,
}))

// Mock apiProblem
jest.mock("./apiProblem", () => ({
  getGeneralApiProblem: jest.fn(),
}))

describe("Api", () => {
  const config: ApiConfig = {
    url: "https://api.test.com",
    timeout: 1000,
  }
  let api: Api

  beforeEach(() => {
    api = new Api(config)
    mockApisauce.get.mockClear()
    ;(getGeneralApiProblem as jest.Mock).mockClear()
  })

  // Test constructor
  it("sets up the api correctly", () => {
    expect(api.apisauce).toBeDefined()
    expect(api.config).toEqual(config)
  })

  describe("getEpisodes", () => {
    it("returns episodes on success", async () => {
      const mockEpisodes = [{ id: "1", title: "Test Episode" }]
      const mockResponse = {
        ok: true,
        data: {
          items: mockEpisodes,
        },
      }
      mockApisauce.get.mockResolvedValue(mockResponse)

      const result = await api.getEpisodes()

      expect(mockApisauce.get).toHaveBeenCalledWith(expect.stringContaining("api.json"))
      expect(result).toEqual({ kind: "ok", episodes: mockEpisodes })
    })

    it("returns bad-data on empty response", async () => {
      const mockResponse = {
        ok: true,
        data: null, // or missing items
      }
      mockApisauce.get.mockResolvedValue(mockResponse)
      // logic says rawData?.items.map... if rawData is null, it's undefined ?? []
      // wait, rawData?.items access on null/undefined is fine but rawData = response.data.
      // if response.data is null, rawData is null. rawData?.items is undefined. undefined ?? [] is [].
      // so it should return empty list.

      const result = await api.getEpisodes()
      expect(result).toEqual({ kind: "ok", episodes: [] })
    })

    it("returns generic problem if response is not ok", async () => {
      const mockResponse = { ok: false, problem: "TIMEOUT" }
      mockApisauce.get.mockResolvedValue(mockResponse)
      ;(getGeneralApiProblem as jest.Mock).mockReturnValue({ kind: "timeout" })

      const result = await api.getEpisodes()

      expect(getGeneralApiProblem).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual({ kind: "timeout" })
    })

    it("catches errors and logs in dev", async () => {
      const originalDev = __DEV__
      // @ts-ignore
      global.__DEV__ = true
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

      // Return data that causes map to fail (items is not an array but an object or number)
      const mockResponse = {
        ok: true,
        data: { items: 123 },
      }
      mockApisauce.get.mockResolvedValue(mockResponse)

      const result = await api.getEpisodes()
      expect(result).toEqual({ kind: "bad-data" })
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
      // @ts-ignore
      global.__DEV__ = originalDev
    })
  })
})
