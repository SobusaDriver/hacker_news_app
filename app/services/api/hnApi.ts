import { ApiResponse, create } from "apisauce"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import { HnSearchResponse } from "./hnTypes"

export class HnApi {
  apisauce = create({
    baseURL: "https://hn.algolia.com/api/v1",
    timeout: 10000,
    headers: {
      Accept: "application/json",
    },
  })

  async getMobileArticles(
    query = "mobile",
  ): Promise<{ kind: "ok"; articles: HnSearchResponse["hits"] } | GeneralApiProblem> {
    const response: ApiResponse<HnSearchResponse> = await this.apisauce.get(
      `/search_by_date?query=${query}`,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData = response.data
      return { kind: "ok", articles: rawData?.hits ?? [] }
    } catch {
      return { kind: "bad-data" }
    }
  }
}

export const hnApi = new HnApi()
