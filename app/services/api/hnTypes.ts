export interface HnArticle {
  objectID: string
  created_at: string
  title: string
  url: string
  author: string
  points: number
  story_text: string | null
  comment_text: string | null
  num_comments: number
  story_id: number | null
  story_title: string | null
  story_url: string | null
  parent_id: number | null
  created_at_i: number
  _tags: string[]
}

export interface HnSearchResponse {
  hits: HnArticle[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  exhaustiveNbHits: boolean
  query: string
  params: string
  processingTimeMS: number
}
