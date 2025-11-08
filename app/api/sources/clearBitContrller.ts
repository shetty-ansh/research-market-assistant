import axios from 'axios'

interface ClearbitCompanyAPI {
  name: string
  domain: string
  category?: { sector?: string; industry?: string }
  metrics?: { employees?: number; raised?: number }
  logo?: string
  description?: string
}

interface ClearbitCompany extends ClearbitCompanyAPI {
  searchKeyword: string
}

interface ClearbitResponse {
  source: 'Clearbit'
  data: ClearbitCompany[]
  totalResults: number
  searchSummary: { keyword: string; success: boolean; url: string }[]
}

/**
 * Fetches company and domain info using Clearbit’s Enrichment API.
 */
export async function fetchClearbitData(clearbitInput: string): Promise<ClearbitResponse | null> {
  const apiKey = process.env.CLEARBIT_API_KEY

  if (!apiKey) {
    console.warn('⚠️ CLEARBIT API - No API key provided')
    return null
  }

  const keywords = clearbitInput
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0)

  const allData: ClearbitCompany[] = []
  const searchSummary: ClearbitResponse['searchSummary'] = []

  try {
    for (const keyword of keywords) {
      console.log(`🏢 Searching Clearbit for "${keyword}"`)

      const url = `https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(keyword)}`

      try {
        // ✅ Explicitly tell Axios the response type
        const res = await axios.get<ClearbitCompanyAPI>(url, {
          auth: { username: apiKey, password: '' },
          timeout: 8000,
        })

        // ✅ Spread is now type-safe
        const company: ClearbitCompany = { ...res.data, searchKeyword: keyword }

        allData.push(company)
        searchSummary.push({ keyword, success: true, url })
      } catch (err: any) {
        console.warn(`⚠️ Clearbit: No data for "${keyword}" (${err.message})`)
        searchSummary.push({ keyword, success: false, url })
      }

      // Avoid rate limits
      await new Promise((r) => setTimeout(r, 400))
    }

    return {
      source: 'Clearbit',
      data: allData.slice(0, 10),
      totalResults: allData.length,
      searchSummary,
    }
  } catch (error: any) {
    console.error('❌ CLEARBIT API ERROR:', error.message)
    return null
  }
}
