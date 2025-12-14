import { hnApi } from "../../app/services/api/hnApi"
import { HnSearchResponse } from "../../app/services/api/hnTypes"

// Mock apisauce
const mockApisauce = {
  get: jest.fn(),
}

// @ts-ignore
hnApi.apisauce = mockApisauce

describe("HnApi", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("fetches mobile articles successfully", async () => {
    const mockData: HnSearchResponse = {
      hits: [
        {
          objectID: "1",
          title: "Test Article",
          url: "http://test.com",
          author: "tester",
          created_at: "2023-01-01T00:00:00Z",
          points: 10,
          num_comments: 5,
          story_title: null,
          story_url: null,
          story_id: null,
          parent_id: null,
          story_text: null,
          comment_text: null,
          created_at_i: 1672531200,
          _tags: [],
        },
      ],
      nbHits: 1,
      page: 0,
      nbPages: 1,
      hitsPerPage: 20,
      exhaustiveNbHits: true,
      query: "mobile",
      params: "",
      processingTimeMS: 10,
    }

    mockApisauce.get.mockResolvedValue({ ok: true, data: mockData })

    const result = await hnApi.getMobileArticles()

    expect(result.kind).toBe("ok")
    if (result.kind === "ok") {
      expect(result.articles).toHaveLength(1)
      expect(result.articles[0].title).toBe("Test Article")
    }
    expect(mockApisauce.get).toHaveBeenCalledWith("/search_by_date?query=mobile")
  })

  it("handles failure gracefully", async () => {
    mockApisauce.get.mockResolvedValue({ ok: false, problem: "NETWORK_ERROR" })

    const result = await hnApi.getMobileArticles()

    expect(result.kind).not.toBe("ok")
  })
})
