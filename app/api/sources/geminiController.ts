import { GoogleGenAI } from '@google/genai'

interface GeminiKeywords {
  newsInput: string
  serpInput: string
  wikiInput: string
  redditInput: string
  trendsInput: string
}

interface GeminiReport {
  title: string
  marketOverview: {
    summary: string
    bullets: string[]
  }
  audienceAndJobs: string[]
  competitors: {
    name: string
    pitch: string
    link: string
    differentiate: string
  }[]
  viability: {
    score: string
    rationale: string[]
    formula: string
  }
  firstExperiments: string[]
  sources: string[]
}

export async function geminiStageOne(idea: string): Promise<GeminiKeywords | null> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('⚠️ GEMINI AI - No API key provided')
    return null
  }

  const ai = new GoogleGenAI({ apiKey })

  const keywordPrompt = `
Role: You are an expert market analyst responsible for extracting the most precise keywords from a new business idea.

Idea: ${idea}

Output Constraint: You must provide the output as a single JSON object with the following exact keys: 
newsInput, serpInput, wikiInput, redditInput, and trendsInput. 

Each of these will be used for relevant searches to find the latest data or trends. 
Example: redditInput will be used to find recent discussions related to the idea. 

Each field should have 3 comma-separated values. 
NO ADDITIONAL TEXT — output ONLY the JSON object.
`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: keywordPrompt }],
        },
      ],
    })

    const generatedText = response?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!generatedText) throw new Error('Gemini did not return valid text content.')

    const cleanText = generatedText.replace(/```json|```/g, '').trim()
    const parsedInputsResult: GeminiKeywords = JSON.parse(cleanText)

    console.log('✅ Extracted Gemini Keywords:')
    console.log('  - News:', parsedInputsResult.newsInput)
    console.log('  - Serp:', parsedInputsResult.serpInput)
    console.log('  - Wiki:', parsedInputsResult.wikiInput)
    console.log('  - Reddit:', parsedInputsResult.redditInput)
    console.log('  - Trends:', parsedInputsResult.trendsInput)

    return parsedInputsResult
  } catch (error: any) {
    if (error.response) {
      console.log('📊 GEMINI API ERROR RESPONSE:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      })
    } else {
      console.error('⚠️ Unexpected Error:', error)
    }
    return null
  }
}

export async function geminiStageTwo (rawData : string , source: string, instructions : string, originalIdea?: string) : Promise <string | null>{
   const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('⚠️ GEMINI AI - No API key provided')
    return null
  }

  const ai = new GoogleGenAI({ apiKey })

  const contextSection = originalIdea ? `
  
  BUSINESS IDEA CONTEXT:
  The user is researching this business idea: "${originalIdea}"
  
  IMPORTANT: Tailor all insights specifically to this business idea. Focus on how the data relates to this specific concept, market, or industry.
  ` : '';

  const prompt = `You need to analyse raw data from ${source} and structure a response including these parameters${instructions}.
  You must provide the output as a single JSON object. NO ADDITIONAL TEXT — output ONLY the JSON object. The insights you extract will
  be used to generate reports as a part of a bigger operation.Structure your response accordingly.${contextSection}
  
  Raw Data to Analyze:
  ${rawData}
  
  Sample - 
  { parameter1: insight1,
    parameter2: insight2
  }`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    })

    const generatedInsights = response?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!generatedInsights) throw new Error('Gemini did not return valid text content.')

    const cleanText = generatedInsights.replace(/```json|```/g, '').trim()
    const parsedResult = JSON.parse(cleanText)

    return parsedResult
  } catch (error: any) {
    if (error.response) {
      console.log('📊 GEMINI API ERROR RESPONSE:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      })
    } else {
      console.error('⚠️ Unexpected Error:', error)
    }
    return null
  }
}

export async function geminiStageThree(
  idea: string,
  newsData: any,
  serpData: any,
  wikiData: any,
  redditData: any,
  trendsData: any
): Promise<GeminiReport | null> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('⚠️ GEMINI AI - No API key provided')
    return null
  }

  const ai = new GoogleGenAI({ apiKey })

  const safeStringify = (data: any): string => {
    if (!data || Object.keys(data).length === 0) return 'null'
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return 'null'
    }
  }

  const reportPrompt = `
You are an advanced startup analyst embedded in a validation tool. A user submits a business idea, and your goal is to produce a concise, actionable **viability report** using all available supporting data.

The following data sources are provided — use each to extract relevant insights:

📊 **Data Sources**
- NewsAPI → current industry headlines, tone, and trends
- SerpAPI → competitors, products, search patterns
- Wikipedia → broad market or technical overviews
- Reddit → user opinions, frustrations, and needs
- Google Trends → interest trajectory and seasonality

🧩**User Idea**
${idea}

🗂 **Structured Data Inputs**
News Data: ${safeStringify(newsData)}
Serp Data: ${safeStringify(serpData)}
Wiki Data: ${safeStringify(wikiData)}
Reddit Data: ${safeStringify(redditData)}
Google Trends Data: ${safeStringify(trendsData)}

🎯 **Your Task**
1. Cross-analyze all sources for signals of opportunity, risk, and differentiation.
2. Assign a **viability score (1–10)** with rationale.
3. Suggest quick validation experiments.

📦 **Output Format (JSON only, no commentary)**
{
  "title": "Concise title derived from the idea",
  "marketOverview": { "summary": "2–3 sentences", "bullets": ["..."] },
  "audienceAndJobs": ["..."],
  "competitors": [{ "name": "...", "pitch": "...", "link": "...", "differentiate": "..." }],
  "viability": { "score": "...", "rationale": ["..."], "formula": "..." },
  "firstExperiments": ["..."],
  "sources": ["List of sources actually used or note 'Limited data'"]
}
`

  try {
    console.log('🧠 Generating full Gemini report...')
    const availability = {
      News: !!newsData,
      Serp: !!serpData,
      Wiki: !!wikiData,
      Reddit: !!redditData,
      Trends: !!trendsData,
    }
    console.table(availability)

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: reportPrompt }],
        },
      ],
    })

    const generatedText = response?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!generatedText) throw new Error('Gemini did not return valid text content.')

    let cleanedText = generatedText.trim()
    if (cleanedText.startsWith('```json'))
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '')
    else if (cleanedText.startsWith('```'))
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '')

    const parsedReport: GeminiReport = JSON.parse(cleanedText)
    console.log('📋 Gemini report generated successfully.')
    return parsedReport
  } catch (error) {
    console.error('⚠️ Error generating Gemini report:', error)
    return null
  }
}




