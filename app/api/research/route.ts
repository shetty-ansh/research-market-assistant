// import { NextRequest, NextResponse } from "next/server";
// import { geminiStageOne } from "../sources/geminiController";
// import { fetchNewsInsights } from "../sources/newsController";
// import { fetchSerpInsights } from "../sources/serpController";
// import { fetchRedditInsights } from "../sources/redditController";
// import { fetchTrendsInsights } from "../sources/trendsController";
// import { fetchWikiInsights } from "../sources/wikipediaController";

// export async function POST(req: NextRequest) {
//     const baseUrl = process.env.NEXT_APP_BASE_URL;

//     console.log("Step 1 - Fetching Keywords")

//     try {
//         const { idea } = await req.json();

//         const response = await fetch(`${baseUrl}/api/keywords`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ idea }),
//         });

//         if (!response.ok) {
//             // fallback to local geminiStageOne if remote fails
//             const fallback = await geminiStageOne(idea);
//             if (!fallback) {
//                 return NextResponse.json({ error: "Failed to generate keywords" }, { status: 500 });
//             }
//             return NextResponse.json({ keywords: fallback });
//         }

//         const payload = await response.json();
//         const keywords = payload?.keywords ?? payload;

//         if (!keywords) {
//             const fallback = await geminiStageOne(idea);
//             if (!fallback) {
//                 return NextResponse.json({ error: "No keywords returned" }, { status: 500 });
//             }
//             return NextResponse.json({ keywords: fallback });
//         }

//         const redditInput = keywords.redditKeywords;
//         const newsInput = keywords.newsKeywords;
//         const serpInput = keywords.serpKeywords;
//         const wikiInput = keywords.wikiKeywords;
//         // const twitterInput = keywords.twitterKeywords;
//         // const clearbitInput = keywords.clearbitKeywords;
//         const trendsInput = keywords.trendsKeywords;

//         console.log("Step 2.1 - Getting Data from NEWS API")

//         try {
//             const newsInsights = await fetchNewsInsights(newsInput);

//             if (!newsInsights) {
//                 throw new Error("Failed to fetch news insights");
//             }
//         } catch (error) {
//             // return null;
//             console.error(NextResponse.json(
//                 { error: "NEWS API Analysis failed" },
//                 { status: 500 }))

//         }

//         console.log("Step 2.2 - Getting Data from SERP API")

//         try {
//             const serpInsights = await fetchSerpInsights(serpInput);

//             if (!serpInsights) {
//                 throw new Error("Failed to fetch news insights");
//             }

//         } catch (error) {
//             // return null;
//             console.error(NextResponse.json(
//                 { error: "SERP Analysis failed" },
//                 { status: 500 }))
//         }

//         console.log("Step 2.3 - Getting Data from Reddit API")

//         try {
//             const redditInsights = await fetchRedditInsights(redditInput);

//             if (!redditInsights) {
//                 throw new Error("Failed to fetch news insights");
//             }

//         } catch (error) {
//             // return null;
//             console.error(NextResponse.json(
//                 { error: "Reddit analysis failed" },
//                 { status: 500 }))
//         }

//         console.log("Step 2.4 - Getting Data from Google Trends")

//         try {
//             const trendsInsghts = await fetchTrendsInsights(trendsInput);

//             if (!trendsInsghts) {
//                 throw new Error("Failed to fetch trends insights");
//             }

//         } catch (error) {
//             // return null;
//             console.error(NextResponse.json(
//                 { error: "Trends analysis failed" },
//                 { status: 500 }))
//         }

//         console.log("Step 2.4 - Getting Data from Wikipedia")

//         try {
//             const wikiInsghts = await fetchWikiInsights(wikiInput);

//             if (!wikiInsghts) {
//                 throw new Error("Failed to fetch Wikipedia insights");
//             }

//         } catch (error) {
//             // return null;
//             console.error(NextResponse.json(
//                 { error: "Wikipedia analysis failed" },
//                 { status: 500 }))
//         }









//         // return NextResponse.json({
//         //   redditInput,
//         //   newsInput,
//         //   serpInput,
//         //   wikiInput,
//         // //   twitterInput,
//         // //   clearbitInput,
//         //   trendsInput,
//         // });
//     } catch (error) {
//         return NextResponse.json({ error: "Keyword fetch failed" }, { status: 500 });
//     }


// }

// import { NextRequest, NextResponse } from "next/server";
// import { geminiStageOne } from "../sources/geminiController";
// import { fetchNewsInsights } from "../sources/newsController";
// import { fetchSerpInsights } from "../sources/serpController";
// import { fetchRedditInsights } from "../sources/redditController";
// import { fetchTrendsInsights } from "../sources/trendsController";
// import { fetchWikiInsights } from "../sources/wikipediaController";

// export async function POST(req: NextRequest) {
//   const baseUrl = process.env.NEXT_APP_BASE_URL;

//   try {
//     const { idea } = await req.json();

//     // ------------------
//     // STEP 1: KEYWORDS
//     // ------------------
//     const keywordsRes = await fetch(`${baseUrl}/api/keywords`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ idea }),
//     });

//     let keywords = null;

//     if (keywordsRes.ok) {
//       const payload = await keywordsRes.json();
//       keywords = payload.keywords ?? payload;
//     } else {
//       keywords = await geminiStageOne(idea);
//     }

//     if (!keywords) {
//       return NextResponse.json(
//         { error: "Failed to generate keywords" },
//         { status: 500 }
//       );
//     }

//     const {
//       redditKeywords,
//       newsKeywords,
//       serpKeywords,
//       wikiKeywords,
//       trendsKeywords,
//     } = keywords;

//     // ----------------------------
//     // STEP 2: NON-FAILING PIPELINE
//     // ----------------------------

//     const newsInsights = await fetchNewsInsights(newsKeywords).catch(() => null);
//     const serpInsights = await fetchSerpInsights(serpKeywords).catch(() => null);
//     const redditInsights = await fetchRedditInsights(redditKeywords).catch(() => null);
//     const trendsInsights = await fetchTrendsInsights(trendsKeywords).catch(() => null);
//     const wikiInsights = await fetchWikiInsights(wikiKeywords).catch(() => null);

//     // -----------------------------
//     // STEP 3: RETURN PARTIAL RESULTS
//     // -----------------------------

//     return NextResponse.json({
//       newsInsights,
//       serpInsights,
//       redditInsights,
//       trendsInsights,
//       wikiInsights,
//     });

//   } catch (err) {
//     return NextResponse.json(
//       { error: "Pipeline failed unexpectedly" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { geminiStageOne } from "../sources/geminiController";
import { fetchNewsInsights } from "../sources/newsController";
import { fetchSerpInsights } from "../sources/serpController";
import { fetchRedditInsights } from "../sources/redditController";
import { fetchTrendsInsights } from "../sources/trendsController";
import { fetchWikiInsights } from "../sources/wikipediaController";

export async function POST(req: NextRequest) {
    console.log("📌 [STEP 0] Pipeline started");

    const baseUrl = process.env.NEXT_APP_BASE_URL;
    console.log("🌐 BASE URL:", baseUrl);

    try {
        console.log("📌 [STEP 1] Parsing request body...");
        const { idea } = await req.json();
        console.log("💡 User Idea:", idea);

        console.log("📌 [STEP 2] Fetching keywords from /api/keywords...");

        const keywordsRes = await fetch(`${baseUrl}/api/keywords`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea }),
        }).catch(e => {
            console.error("❌ Fetch to /api/keywords failed:", e);
            return null;
        });

        let keywords = null;

        if (keywordsRes && keywordsRes.ok) {
            console.log("✅ Keywords endpoint responded successfully");
            const payload = await keywordsRes.json();
            keywords = payload.keywords ?? payload;
        } else {
            console.error("⚠️ Keywords endpoint failed. Using fallback geminiStageOne...");
            keywords = await geminiStageOne(idea);
        }

        if (!keywords) {
            console.error("❌ No keywords could be generated at all");
            return NextResponse.json({ error: "Failed to generate keywords" }, { status: 500 });
        }

        console.log("📝 Keywords received:", keywords);

        const {
            redditInput: redditKeywords,
            newsInput: newsKeywords,
            serpInput: serpKeywords,
            wikiInput: wikiKeywords,
            trendsInput: trendsKeywords
        } = keywords;


        // ----------------------------
        // FETCH EACH SOURCE (Safe Mode)
        // ----------------------------

        console.log("📌 [STEP 3.1] Fetching News Insights...");
        const newsInsights = await fetchNewsInsights(newsKeywords).catch(err => {
            console.error("❌ NEWS Insights Error:", err);
            return null;
        });
        console.log("📰 News Insights:", newsInsights);

        console.log("📌 [STEP 3.2] Fetching SERP Insights...");
        const serpInsights = await fetchSerpInsights(serpKeywords).catch(err => {
            console.error("❌ SERP Insights Error:", err);
            return null;
        });
        console.log("🔍 SERP Insights:", serpInsights);

        console.log("📌 [STEP 3.3] Fetching Reddit Insights...");
        const redditInsights = await fetchRedditInsights(redditKeywords).catch(err => {
            console.error("❌ Reddit Insights Error:", err);
            return null;
        });
        console.log("👽 Reddit Insights:", redditInsights);

        console.log("📌 [STEP 3.4] Fetching Trends Insights...");
        const trendsInsights = await fetchTrendsInsights(trendsKeywords).catch(err => {
            console.error("❌ Trends Insights Error:", err);
            return null;
        });
        console.log("📈 Google Trends Insights:", trendsInsights);

        console.log("📌 [STEP 3.5] Fetching Wikipedia Insights...");
        const wikiInsights = await fetchWikiInsights(wikiKeywords).catch(err => {
            console.error("❌ Wikipedia Insights Error:", err);
            return null;
        });
        console.log("📘 Wikipedia Insights:", wikiInsights);

        // -----------------------------------
        // FINAL RESPONSE
        // -----------------------------------

        console.log("📌 [FINAL STEP] Returning gathered insights...");

        return NextResponse.json({
            newsInsights,
            serpInsights,
            redditInsights,
            trendsInsights,
            wikiInsights
        });

    } catch (error) {
        console.error("🔥 PIPELINE CRASHED:", error);
        return NextResponse.json(
            { error: "Pipeline failed unexpectedly", details: String(error) },
            { status: 500 }
        );
    }
}
