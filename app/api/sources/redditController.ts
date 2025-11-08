import axios from 'axios'

interface RedditAPIResponse {
  data: {
    children: {
      data: {
        id: string
        title: string
        permalink: string
        subreddit: string
        score: number
        num_comments: number
        created_utc: number
      }
    }[]
  }
}

interface RedditPost {
  id: string
  title: string
  url: string
  subreddit: string
  score: number
  num_comments: number
  created_utc: number
  searchKeyword: string
}

interface RedditResponse {
  source: 'Reddit'
  data: RedditPost[]
  totalResults: number
  searchSummary: { keyword: string; postsCount: number; url: string }[]
}

export async function fetchRedditData(redditInput: string): Promise<RedditResponse | null> {
  const keywords = redditInput.split(',').map((k) => k.trim()).filter((k) => k.length > 0)
  const allPosts: RedditPost[] = []
  const searchSummary: RedditResponse['searchSummary'] = []

  try {
    for (const keyword of keywords) {
      console.log(`🔺 Searching Reddit for "${keyword}"`)
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=5`

      // ✅ Explicitly type the Axios response
      const res = await axios.get<RedditAPIResponse>(url, { timeout: 8000 })

      const posts: RedditPost[] =
        res.data?.data?.children?.map((child) => ({
          id: child.data.id,
          title: child.data.title,
          url: `https://www.reddit.com${child.data.permalink}`,
          subreddit: child.data.subreddit,
          score: child.data.score,
          num_comments: child.data.num_comments,
          created_utc: child.data.created_utc,
          searchKeyword: keyword,
        })) || []

      allPosts.push(...posts)
      searchSummary.push({ keyword, postsCount: posts.length, url })

      // Small delay to avoid API throttling
      await new Promise((r) => setTimeout(r, 300))
    }

    return {
      source: 'Reddit',
      data: allPosts.slice(0, 15),
      totalResults: allPosts.length,
      searchSummary,
    }
  } catch (error: any) {
    console.error('❌ REDDIT API ERROR:', error.message)
    return null
  }
}
