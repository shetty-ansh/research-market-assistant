// import { geminiStageTwo } from "./geminiController";

// export async function fetchRedditInsights(redditKeywords: string) {
//   const apiKey = process.env.REDDIT_API_KEY;
//   const redditUser = process.env.REDDIT_USERNAME;
//   const redditPass = process.env.REDDIT_PASSWORD;
//   const redditClientId = process.env.REDDIT_CLIENT_ID;
//   const redditSecret = process.env.REDDIT_SECRET;

//   // Basic safety check
//   if (!redditClientId || !redditSecret || !redditUser || !redditPass) {
//     console.error("Missing Reddit API credentials");
//     return null;
//   }

//   try {
//     // 1. --- AUTH ---
//     const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
//       method: "POST",
//       headers: {
//         Authorization:
//           "Basic " + Buffer.from(`${redditClientId}:${redditSecret}`).toString("base64"),
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: `grant_type=password&username=${redditUser}&password=${redditPass}`,
//     });

//     const tokenJson = await tokenRes.json();
//     const accessToken = tokenJson.access_token;

//     if (!accessToken) {
//       console.error("Failed Reddit OAuth token");
//       return null;
//     }

//     // 2. --- FETCH SUBMISSIONS ---
//     const redditRes = await fetch(
//       `https://oauth.reddit.com/search?q=${encodeURIComponent(
//         redditKeywords
//       )}&limit=15&sort=relevance&type=link`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "User-Agent": "MarketResearchAI/1.0",
//         },
//       }
//     );

//     if (!redditRes.ok) {
//       console.error("Failed to fetch Reddit posts");
//       return null;
//     }

//     const redditJson = await redditRes.json();
//     const posts = redditJson.data?.children || [];

//     // 3. --- COMPRESS RAW DATA ---
//     const rawData = posts.map((p: any) => ({
//       title: p.data.title,
//       selftext: p.data.selftext,
//       score: p.data.score,
//       num_comments: p.data.num_comments,
//       subreddit: p.data.subreddit,
//       created_utc: p.data.created_utc,
//     }));

//     // 4. --- GEMINI STAGE TWO INSTRUCTIONS ---
//     const instructions = `{
//       "avgUpvotes": "Average upvotes across posts",
//       "sentimentScore": "Overall sentiment score of all posts (-1 to +1)",
//       "commonKeywords": "Most frequent terms from titles & bodies",
//       "topPainPoints": "Most discussed pain points from users",
//       "topWishes": "What users want or request most often",
//       "overallSummary": "2–3 line summary of Reddit sentiment"
//     }`;

//     // 5. --- CALL GEMINI ---
//     const insights = await geminiStageTwo(
//       JSON.stringify(rawData),
//       "RedditAPI",
//       instructions
//     );

//     return insights || null;
//   } catch (err) {
//     console.error("Reddit Insights Error:", err);
//     return null;
//   }
// }

import { geminiStageTwo } from "./geminiController";

export async function fetchRedditInsights(redditKeywords: string, originalIdea?: string) {
  const serpApiKey = process.env.SERP_API_KEY;

  if (!serpApiKey) {
    console.error("❌ Missing SERP API Key");
    return null;
  }

  try {
    console.log("📡 [Reddit-SERP] Searching posts using Google...");

    const keywords = redditKeywords
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    let allPosts: any[] = [];

    for (const kw of keywords) {
      console.log(`⬇️ Searching Google for Reddit posts (keyword: ${kw})`);

      const url =
        `https://serpapi.com/search.json?engine=google` +
        `&q=${encodeURIComponent(`site:reddit.com ${kw}`)}` +
        `&num=15&api_key=${serpApiKey}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error("❌ SERP fetch failed:", res.status);
        continue;
      }

      const json = await res.json();
      const organic = json.organic_results || [];

      // extract reddit-only results with minimal filtering
      const posts = organic
        .filter((r: any) => {
          const link = r.link?.toLowerCase() || "";
          // Must be from reddit
          return link.includes("reddit.com");
        })
        .map((r: any) => ({
          title: r.title || "",
          snippet: r.snippet || "",
          link: r.link || "",
          displayed_link: r.displayed_link || "",
        }));

      if (!posts.length) {
        console.warn(`⚠️ No Reddit results found for keyword: ${kw}`);
      }

      allPosts.push(...posts);

      // Add delay between requests to avoid rate limits
      if (keywords.indexOf(kw) < keywords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!allPosts.length) {
      console.warn("⚠️ No Reddit posts found, returning fallback insights");
      return {
        commonKeywords: ["limited data"],
        topicSentiment: 0,
        topPainPoints: ["No specific Reddit discussions found for this topic"],
        topWishes: ["More community discussions needed"],
        overallSummary: "Limited Reddit activity found for this topic. Consider broader keyword search or direct community engagement."
      };
    }

    console.log(`📥 Found Reddit-related posts: ${allPosts.length}`);

    // Convert to your rawData structure
    const rawData = allPosts.map((p: any) => ({
      title: p.title,
      selftext: p.snippet,
      url: p.link,
      score: null,
      num_comments: null,
      subreddit: p.link.match(/reddit\.com\/r\/([^/]+)/)?.[1] || "",
      created_utc: null,
    }));

    // Gemini instructions
    const instructions = `{
      "commonKeywords": "Most common terms users mention",
      "topicSentiment": "General sentiment (-1 to +1)",
      "topPainPoints": "Most mentioned user problems",
      "topWishes": "Features people want",
      "overallSummary": "Short 2–3 line summary of Reddit landscape"
    }`;

    const insights = await geminiStageTwo(
      JSON.stringify(rawData),
      "Google-SERP-Reddit",
      instructions,
      originalIdea
    );

    return insights || null;
  } catch (err) {
    console.error("❌ Reddit Insights Error:", err);
    return null;
  }
}
