import axios from 'axios'

interface NewsArticle {
  source?: { id?: string; name?: string }
  author?: string
  title?: string
  description?: string
  url: string
  urlToImage?: string
  publishedAt?: string
  content?: string
  searchKeyword: string
}

interface SearchResult {
  keyword: string
  articlesCount: number
  url?: string
  error?: string
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: Omit<NewsArticle, 'searchKeyword'>[]
}

interface NewsResponse {
  source: 'NewsAPI'
  data: {
    articles: NewsArticle[]
    totalResults: number
    searchResults: SearchResult[]
  }
  searchSummary: SearchResult[]
}

/**
 * Fetches recent news articles for a given comma-separated keyword list.
 */
export async function fetchNewsData(newsInput: string): Promise<NewsResponse | null> {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    console.warn('⚠️ NEWS API - No API key provided')
    return null
  }

  try {
    const keywords = newsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const allArticles: NewsArticle[] = []
    const searchResults: SearchResult[] = []

    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i]
      console.log(`\n📰 Searching ${i + 1}/${keywords.length}: "${keyword}"`)

      try {
        const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          keyword
        )}&apiKey=${apiKey}&pageSize=3&sortBy=publishedAt`

        // ✅ Strongly typed axios call
        const res = await axios.get<NewsAPIResponse>(newsUrl, { timeout: 8000 })
        const articles = res.data?.articles || []

        if (articles.length > 0) {
          const articlesWithKeyword: NewsArticle[] = articles.map((article) => ({
            ...article,
            searchKeyword: keyword,
          }))

          allArticles.push(...articlesWithKeyword)
          searchResults.push({
            keyword,
            articlesCount: articles.length,
            url: newsUrl.replace(apiKey, '[API_KEY]'),
          })
        }

        if (i < keywords.length - 1) await new Promise((res) => setTimeout(res, 200))
      } catch (keywordError: any) {
        console.error(`❌ Error searching for "${keyword}":`, keywordError.message)
        searchResults.push({
          keyword,
          error: keywordError.message,
          articlesCount: 0,
        })
      }
    }

    // ✅ Deduplicate by URL
    const uniqueArticles = allArticles.filter(
      (article, index, self) => index === self.findIndex((a) => a.url === article.url)
    )

    console.log(`📰 Total unique articles found: ${uniqueArticles.length}`)

    if (uniqueArticles.length > 0) {
      console.log('✅ NEWS API - Success')
      return {
        source: 'NewsAPI',
        data: {
          articles: uniqueArticles.slice(0, 15),
          totalResults: uniqueArticles.length,
          searchResults,
        },
        searchSummary: searchResults,
      }
    }

    console.warn('⚠️ NEWS API - No articles found for any keywords')
    return null
  } catch (error: any) {
    console.error('❌ NEWS API ERROR:', error.message)
    return null
  }
}
