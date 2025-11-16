// src/app/api/sources/redditController.ts
import { geminiStageTwo } from "./geminiController";

export async function fetchRedditInsights(redditKeywords: string) {
  const apiKey = process.env.REDDIT_API_KEY;
  const redditUser = process.env.REDDIT_USERNAME;
  const redditPass = process.env.REDDIT_PASSWORD;
  const redditClientId = process.env.REDDIT_CLIENT_ID;
  const redditSecret = process.env.REDDIT_SECRET;

  // Basic safety check
  if (!redditClientId || !redditSecret || !redditUser || !redditPass) {
    console.error("Missing Reddit API credentials");
    return null;
  }

  try {
    // 1. --- AUTH ---
    const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${redditClientId}:${redditSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=password&username=${redditUser}&password=${redditPass}`,
    });

    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;

    if (!accessToken) {
      console.error("Failed Reddit OAuth token");
      return null;
    }

    // 2. --- FETCH SUBMISSIONS ---
    const redditRes = await fetch(
      `https://oauth.reddit.com/search?q=${encodeURIComponent(
        redditKeywords
      )}&limit=15&sort=relevance&type=link`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "MarketResearchAI/1.0",
        },
      }
    );

    if (!redditRes.ok) {
      console.error("Failed to fetch Reddit posts");
      return null;
    }

    const redditJson = await redditRes.json();
    const posts = redditJson.data?.children || [];

    // 3. --- COMPRESS RAW DATA ---
    const rawData = posts.map((p: any) => ({
      title: p.data.title,
      selftext: p.data.selftext,
      score: p.data.score,
      num_comments: p.data.num_comments,
      subreddit: p.data.subreddit,
      created_utc: p.data.created_utc,
    }));

    // 4. --- GEMINI STAGE TWO INSTRUCTIONS ---
    const instructions = `{
      "avgUpvotes": "Average upvotes across posts",
      "sentimentScore": "Overall sentiment score of all posts (-1 to +1)",
      "commonKeywords": "Most frequent terms from titles & bodies",
      "topPainPoints": "Most discussed pain points from users",
      "topWishes": "What users want or request most often",
      "overallSummary": "2–3 line summary of Reddit sentiment"
    }`;

    // 5. --- CALL GEMINI ---
    const insights = await geminiStageTwo(
      JSON.stringify(rawData),
      "RedditAPI",
      instructions
    );

    return insights || null;
  } catch (err) {
    console.error("Reddit Insights Error:", err);
    return null;
  }
}
