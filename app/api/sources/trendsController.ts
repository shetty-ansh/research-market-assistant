// src/app/api/sources/trendsController.ts
import { geminiStageTwo } from "./geminiController";

export async function fetchTrendsInsights(trendsKeywords: string, originalIdea?: string) {
  const serpApiKey = process.env.SERP_API_KEY;

  if (!serpApiKey) {
    console.error("❌ Missing SERP API Key for trends");
    return null;
  }

  try {
    console.log("📈 [Trends] Using SerpAPI for trends data:", trendsKeywords);

    // Split keywords and get trends for each
    const keywords = trendsKeywords
      .split(",")
      .map(k => k.trim())
      .filter(Boolean)
      .slice(0, 3); // Limit to 3 keywords to avoid rate limits

    let allTrendsData: any[] = [];

    for (const keyword of keywords) {
      console.log(`📊 Getting trends for: ${keyword}`);
      
      try {
        const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&data_type=TIMESERIES&api_key=${serpApiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.warn(`⚠️ Trends API failed for "${keyword}": ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.interest_over_time && data.interest_over_time.timeline_data) {
          allTrendsData.push({
            keyword,
            timeline: data.interest_over_time.timeline_data,
            related_queries: data.related_queries || []
          });
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.warn(`⚠️ Error fetching trends for "${keyword}":`, err);
        continue;
      }
    }

    // If no trends data found, return fallback
    if (!allTrendsData.length) {
      console.log("⚠️ No trends data found, returning fallback");
      return {
        trendDirection: "stable",
        percentageChange: "0%",
        volatilityScore: 0.5,
        seasonalPatterns: "Data unavailable",
        peakMonths: ["Data unavailable"],
        lowMonths: ["Data unavailable"],
        overallSummary: "Trends data temporarily unavailable. This could indicate a niche market with limited search volume or API limitations."
      };
    }

    console.log(`📈 Found trends data for ${allTrendsData.length} keywords`);

    // ---- INSTRUCTIONS FOR GEMINI ----
    const instructions = `{
      "trendDirection": "Overall direction: upward, downward, or stable",
      "percentageChange": "Percentage change between start and end periods",
      "volatilityScore": "Variation level from 0 to 1",
      "seasonalPatterns": "Does interest show repeating spikes or patterns?",
      "peakMonths": "Months with highest interest",
      "lowMonths": "Months with lowest interest",
      "overallSummary": "Short 2–3 line explanation of search trend patterns"
    }`;

    // ---- LLM PROCESSING ----
    const insights = await geminiStageTwo(
      JSON.stringify(allTrendsData),
      "GoogleTrends-SerpAPI",
      instructions,
      originalIdea
    );

    return insights || {
      trendDirection: "stable",
      percentageChange: "0%",
      volatilityScore: 0.5,
      seasonalPatterns: "Analysis in progress",
      peakMonths: ["Data processing"],
      lowMonths: ["Data processing"],
      overallSummary: "Trends analysis completed with available data."
    };

  } catch (error) {
    console.error("❌ Trends Insights Error:", error);
    return {
      trendDirection: "stable",
      percentageChange: "0%",
      volatilityScore: 0.5,
      seasonalPatterns: "Error retrieving data",
      peakMonths: ["Data unavailable"],
      lowMonths: ["Data unavailable"],
      overallSummary: "Unable to retrieve trends data due to technical issues. Consider manual research at trends.google.com"
    };
  }
}
