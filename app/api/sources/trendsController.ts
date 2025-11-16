// src/app/api/sources/trendsController.ts
import { geminiStageTwo } from "./geminiController";

export async function fetchTrendsInsights(trendsKeywords: string) {
  try {
    console.log("📈 [Trends] Keyword:", trendsKeywords);

    // ---- STEP 1: GET TOKEN ----
    const exploreReq = {
      comparisonItem: [
        {
          keyword: trendsKeywords,
          geo: "",
          time: "today 12-m" // last 12 months
        }
      ],
      category: 0,
      property: ""
    };

    const exploreURL =
      "https://trends.google.com/trends/api/explore?hl=en-US&req=" +
      encodeURIComponent(JSON.stringify(exploreReq));

    const exploreRes = await fetch(exploreURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
      }
    });

    if (!exploreRes.ok) {
      console.error("❌ Google Trends explore failed:", exploreRes.status);
      return null;
    }

    let exploreText = await exploreRes.text();
    exploreText = exploreText.replace(")]}',", ""); // remove prefix

    let exploreJson = JSON.parse(exploreText);
    const widget = exploreJson.widgets?.find((w: any) => w.id === "TIMESERIES");

    if (!widget) {
      console.error("❌ No TIMESERIES widget found");
      return null;
    }

    const token = widget.token;
    const request = widget.request;

    if (!token || !request) {
      console.error("❌ Missing token or request object");
      return null;
    }

    // ---- STEP 2: GET TIMELINE DATA ----
    const timelineURL =
      "https://trends.google.com/trends/api/widgetdata/multiline?hl=en-US&token=" +
      token +
      "&req=" +
      encodeURIComponent(JSON.stringify(request));

    const timelineRes = await fetch(timelineURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
      }
    });

    if (!timelineRes.ok) {
      console.error("❌ Trends timeline fetch failed:", timelineRes.status);
      return null;
    }

    let timelineText = await timelineRes.text();
    timelineText = timelineText.replace(")]}',", "");

    const timelineJson = JSON.parse(timelineText);
    const points = timelineJson.default?.timelineData || [];

    if (!points.length) {
      console.error("⚠️ No trend timeline data found");
      return null;
    }

    // ---- STEP 3: COMPRESS RAW DATA ----
    const rawData = points.map((p: any) => ({
      time: p.formattedTime,
      timestamp: p.time,
      value: p.value?.[0] ?? 0
    }));

    console.log("📈 Raw Google Trends Points:", rawData.length);

    // ---- STEP 4: INSTRUCTIONS FOR GEMINI ----
    const instructions = `{
      "trendDirection": "Overall direction: upward, downward, or stable",
      "percentageChange": "Percentage change between start and end",
      "volatilityScore": "Variation level from 0 to 1",
      "seasonalPatterns": "Does interest show repeating spikes?",
      "peakMonths": "Months with highest interest",
      "lowMonths": "Months with lowest interest",
      "overallSummary": "Short 2–3 line explanation of search trend"
    }`;

    // ---- STEP 5: LLM PROCESSING ----
    const insights = await geminiStageTwo(
      JSON.stringify(rawData),
      "GoogleTrends",
      instructions
    );

    return insights || null;
  } catch (error) {
    console.error("❌ Trends Insights Error:", error);
    return null;
  }
}
