// src/app/api/sources/serpController.ts
import { geminiStageTwo } from "./geminiController";

export async function fetchSerpInsights(serpKeywords: string) {
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    console.error("Missing SERP API key");
    return null;
  }

  try {
    // 1. Fetch raw SERP search results
    const serpRes = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        serpKeywords
      )}&engine=google&api_key=${apiKey}`
    );

    if (!serpRes.ok) {
      console.error("Failed to fetch SERP results");
      return null;
    }

    const serp = await serpRes.json();

    // Extract only useful compact data
    const organic = serp.organic_results || [];
    const related = serp.related_questions || [];
    const ads = serp.ads || [];

    // 2. Build compact raw data block
    const rawData = {
      organic: organic.map((r: any) => ({
        title: r.title,
        snippet: r.snippet,
        link: r.link,
        position: r.position,
      })),
      relatedQuestions: related.map((q: any) => q.question),
      ads: ads.map((ad: any) => ({
        title: ad.title,
        snippet: ad.snippet,
        link: ad.link,
      })),
    };

    // 3. Instructions for Gemini Stage Two
    const instructions = `{
      "competitorList": "Top competitors appearing in organic results",
      "adPresence": "Whether ads are heavy, moderate, or minimal",
      "topQuestions": "Most common questions people ask",
      "keywordIntent": "User search intent behind the queries",
      "marketOpportunities": "Gaps competitors aren't addressing",
      "overallSummary": "2–3 line summary of the search landscape"
    }`;

    // 4. Run through LLM
    const insights = await geminiStageTwo(
      JSON.stringify(rawData),
      "SERPAPI",
      instructions
    );

    return insights || null;
  } catch (err) {
    console.error("SERP Insights Error:", err);
    return null;
  }
}
