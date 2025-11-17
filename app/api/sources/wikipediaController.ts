// src/app/api/sources/wikiController.ts
import { geminiStageTwo } from "./geminiController";

export async function fetchWikiInsights(wikiKeywords: string, originalIdea?: string) {
  try {
    const searchTerm = encodeURIComponent(wikiKeywords);

    // 1. --- SEARCH WIKIPEDIA TITLES ---
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&format=json&utf8=1`
    );

    if (!searchRes.ok) {
      console.error("Failed to search Wikipedia");
      return null;
    }

    const searchJson = await searchRes.json();
    const firstResult = searchJson.query?.search?.[0];

    if (!firstResult) {
      console.error("Wikipedia returned no results");
      return null;
    }

    const pageTitle = firstResult.title;

    // 2. --- GET FULL ARTICLE SUMMARY + CONTENT ---
    const pageRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
    );

    if (!pageRes.ok) {
      console.error("Failed to fetch Wikipedia page summary");
      return null;
    }

    const summaryJson = await pageRes.json();

    // 3. --- GET SECTIONS (OPTIONAL BUT USEFUL) ---
    const sectionsRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
        pageTitle
      )}&prop=sections&format=json`
    );

    const sectionsJson = sectionsRes.ok ? await sectionsRes.json() : null;
    const sections = sectionsJson?.parse?.sections || [];

    // 4. --- PREP COMPRESSED RAW DATA ---
    const rawData = {
      title: summaryJson.title,
      description: summaryJson.description,
      extract: summaryJson.extract,
      sections: sections.map((s: any) => s.line).slice(0, 10),
    };

    // 5. --- GEMINI STAGE TWO INSTRUCTIONS ---
    const instructions = `{
      "topicDefinition": "A clear beginner-friendly definition of the topic",
      "keyConcepts": "3–6 important concepts related to this topic",
      "industryApplications": "Practical uses or applications in the real world",
      "historicalContext": "Important timeline or historical evolution",
      "currentRelevance": "Why this topic matters today",
      "overallSummary": "2–3 line summary combining all insights"
    }`;

    // 6. --- CALL GEMINI STAGE TWO ---
    const insights = await geminiStageTwo(
      JSON.stringify(rawData),
      "WikipediaAPI",
      instructions,
      originalIdea
    );

    return insights || null;
  } catch (err) {
    console.error("Wikipedia Insights Error:", err);
    return null;
  }
}
