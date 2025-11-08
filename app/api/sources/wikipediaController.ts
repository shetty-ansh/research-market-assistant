import axios from 'axios'

interface WikiAPIResponse {
  title: string
  extract: string
  description?: string
  thumbnail?: { source: string; width: number; height: number }
  content_urls?: { desktop?: { page?: string } }
}

interface WikiSummary extends WikiAPIResponse {
  searchKeyword: string
  actualSearchTerm?: string
  url: string
}

interface WikiSearchResult {
  keyword: string
  found: boolean
  title?: string
  actualSearchTerm?: string
  url?: string
  error?: string
}

interface WikiResponse {
  source: 'Wikipedia'
  data: WikiSummary[]
  searchSummary: WikiSearchResult[]
  totalResults: number
}

/**
 * Fetches Wikipedia summaries for each keyword.
 */
export async function fetchWikiData(wikiInput: string): Promise<WikiResponse | null> {
  try {
    const keywords = wikiInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    console.log('🔍 Keywords to search:', keywords)

    const allWikiData: WikiSummary[] = []
    const searchResults: WikiSearchResult[] = []

    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i]
      console.log(`\n📖 Searching ${i + 1}/${keywords.length}: "${keyword}"`)

      try {
        const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`
        const res = await axios.get<WikiAPIResponse>(wikipediaUrl, { timeout: 5000 })

        if (res.data?.extract) {
          console.log(`✅ Wikipedia data found for "${keyword}"`)
          const wikiEntry: WikiSummary = {
            ...res.data,
            searchKeyword: keyword,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(keyword)}`,
          }

          allWikiData.push(wikiEntry)
          searchResults.push({
            keyword,
            found: true,
            title: res.data.title,
            url: wikiEntry.url,
          })
        } else {
          console.log(`⚠️ No Wikipedia data for "${keyword}"`)
          searchResults.push({ keyword, found: false, error: 'No extract found' })
        }

        if (i < keywords.length - 1) await new Promise((res) => setTimeout(res, 200))
      } catch (keywordError: any) {
        console.error(`❌ Error searching for "${keyword}":`, keywordError.message)

        const words = keyword.split(' ').filter((w) => w.length > 3)
        let foundAlternative = false

        for (const word of words) {
          try {
            const wordUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`
            const wordRes = await axios.get<WikiAPIResponse>(wordUrl, { timeout: 3000 })

            if (wordRes.data?.extract) {
              console.log(`✅ Wikipedia data found for word "${word}" from keyword "${keyword}"`)
              const wikiEntry: WikiSummary = {
                ...wordRes.data,
                searchKeyword: keyword,
                actualSearchTerm: word,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(word)}`,
              }

              allWikiData.push(wikiEntry)
              searchResults.push({
                keyword,
                found: true,
                actualSearchTerm: word,
                title: wordRes.data.title,
                url: wikiEntry.url,
              })

              foundAlternative = true
              break
            }
          } catch {
            /* ignore */
          }
        }

        if (!foundAlternative) {
          searchResults.push({ keyword, found: false, error: keywordError.message })
        }
      }
    }

    console.log(`📖 Total Wikipedia entries found: ${allWikiData.length}`)

    if (allWikiData.length > 0) {
      console.log('✅ WIKIPEDIA API - Success')
      return {
        source: 'Wikipedia',
        data: allWikiData.slice(0, 5),
        searchSummary: searchResults,
        totalResults: allWikiData.length,
      }
    }

    console.warn('⚠️ No Wikipedia data found for any keywords')
    return null
  } catch (error: any) {
    console.error('❌ WIKIPEDIA API CRITICAL ERROR:', error.message)
    return null
  }
}
