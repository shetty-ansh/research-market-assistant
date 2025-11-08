import axios from 'axios'

interface Tweet {
  id: string
  text: string
  author_id?: string
  created_at?: string
  searchKeyword: string
}

interface TwitterAPIResponse {
  data: {
    id: string
    text: string
    author_id?: string
    created_at?: string
  }[]
}

interface TwitterResponse {
  source: 'Twitter'
  data: Tweet[]
  totalResults: number
  searchSummary: { keyword: string; tweetsCount: number; url: string }[]
}

export async function fetchTwitterData(twitterInput: string): Promise<TwitterResponse | null> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    console.warn('⚠️ TWITTER API - No Bearer Token provided')
    return null
  }

  const keywords = twitterInput.split(',').map((k) => k.trim()).filter((k) => k.length > 0)
  const allTweets: Tweet[] = []
  const searchSummary: TwitterResponse['searchSummary'] = []

  try {
    for (const keyword of keywords) {
      console.log(`🐦 Searching Twitter for "${keyword}"`)

      const url = `https://api.x.com/2/tweets/search/recent?query=${encodeURIComponent(
        keyword
      )}&max_results=5&tweet.fields=author_id,created_at`

      // ✅ Explicitly type the response
      const res = await axios.get<TwitterAPIResponse>(url, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        timeout: 8000,
      })

      const tweets: Tweet[] =
        res.data?.data?.map((tweet) => ({
          ...tweet,
          searchKeyword: keyword,
        })) || []

      allTweets.push(...tweets)
      searchSummary.push({ keyword, tweetsCount: tweets.length, url })

      // Small delay to prevent hitting Twitter rate limits
      await new Promise((r) => setTimeout(r, 300))
    }

    return {
      source: 'Twitter',
      data: allTweets.slice(0, 15),
      totalResults: allTweets.length,
      searchSummary,
    }
  } catch (error: any) {
    console.error('❌ TWITTER API ERROR:', error.message)
    return null
  }
}
