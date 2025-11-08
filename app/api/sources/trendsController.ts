import googleTrends from 'google-trends-api'

interface TrendData {
  keyword: string
  interest_over_time: any
}

interface TrendsResponse {
  source: 'GoogleTrends'
  data: TrendData[]
  totalResults: number
  searchSummary: { keyword: string; found: boolean }[]
}

export async function fetchTrendsData(trendsInput: string): Promise<TrendsResponse | null> {
  const keywords = trendsInput.split(',').map((k) => k.trim()).filter((k) => k.length > 0)
  const trendResults: TrendData[] = []
  const searchSummary: TrendsResponse['searchSummary'] = []

  try {
    for (const keyword of keywords) {
      console.log(`📊 Fetching Google Trends data for "${keyword}"`)
      try {
        const results = await googleTrends.interestOverTime({ keyword, startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) })
        const parsed = JSON.parse(results)
        trendResults.push({ keyword, interest_over_time: parsed })
        searchSummary.push({ keyword, found: true })
      } catch (err: any) {
        console.warn(`⚠️ No Google Trends data for "${keyword}"`)
        searchSummary.push({ keyword, found: false })
      }
      await new Promise((r) => setTimeout(r, 400))
    }

    return {
      source: 'GoogleTrends',
      data: trendResults,
      totalResults: trendResults.length,
      searchSummary,
    }
  } catch (error: any) {
    console.error('❌ GOOGLE TRENDS ERROR:', error.message)
    return null
  }
}
