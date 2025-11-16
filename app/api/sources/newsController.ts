// src/app/api/sources/newsController.ts (or anywhere you want)
import { geminiStageTwo } from "./geminiController";

export async function fetchNewsInsights(newsKeywords: string) {
  const apiKey = process.env.NEWS_API_KEY;
  const baseUrl = "https://newsapi.org/v2/everything";

  if (!apiKey) {
    console.error("Missing NEWS API key");
    return null;
  }

  try {
    // 1. Fetch raw news articles
    const newsRes = await fetch(
      `${baseUrl}?q=${encodeURIComponent(newsKeywords)}&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`
    );

    if (!newsRes.ok) {
      console.error("Failed to fetch news");
      return null;
    }

    const news = await newsRes.json();
    const articles = news.articles || [];

    // 2. Prepare raw data for LLM (compact)
    const rawData = articles
      .map((a: { title: any; description: any; publishedAt: any; source: { name: any; }; content: any; }) => ({
        title: a.title,
        description: a.description,
        publishedAt: a.publishedAt,
        source: a.source?.name,
        content: a.content,
      }))
      .slice(0, 15);

    // 3. Instructions for Gemini Stage 2
    const instructions = `{
      "articleCount": "Total number of articles analyzed",
      "recency": "Analyse ow fresh the news is",
      "sentimentScore": "Overall sentiment score (-1 to +1)",
      "topThemes": "3–5 recurring themes",
      "marketRisks": "Major risks mentioned",
      "marketOpportunities": "Major opportunities mentioned",
      "commonKeywords": "Most common keywords across articles",
      "overallSummary": "Short 2–3 line news summary"
    }`;

    // 4. Call Gemini Stage Two
    const insights = await geminiStageTwo(
      JSON.stringify(rawData),
      "NewsAPI",
      instructions
    );

    return insights || null;
  } catch (err) {
    console.error("News Insight Error:", err);
    return null;
  }
}
