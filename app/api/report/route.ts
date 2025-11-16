import { NextRequest, NextResponse } from "next/server";
import { geminiStageThree } from "../sources/geminiController";

export async function POST(req: NextRequest) {
  console.log("📊 [REPORT GENERATION] Starting comprehensive report generation...");

  try {
    const { idea } = await req.json();
    console.log("💡 User Idea for Report:", idea);

    // Step 1: Get research data from /research endpoint
    console.log("📌 [STEP 1] Fetching research data...");
    const baseUrl = process.env.NEXT_APP_BASE_URL || 'http://localhost:3000';
    
    const researchResponse = await fetch(`${baseUrl}/api/research`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    if (!researchResponse.ok) {
      console.error("❌ Research endpoint failed");
      return NextResponse.json(
        { error: "Failed to fetch research data" },
        { status: 500 }
      );
    }

    const researchData = await researchResponse.json();
    console.log("✅ Research data received");

    const {
      newsInsights,
      serpInsights,
      redditInsights,
      trendsInsights,
      wikiInsights
    } = researchData;

    // Step 2: Generate comprehensive report using Gemini Stage 3
    console.log("📌 [STEP 2] Generating comprehensive report with Gemini Stage 3...");
    
    const geminiReport = await geminiStageThree(
      idea,
      newsInsights,
      serpInsights,
      wikiInsights,
      redditInsights,
      trendsInsights
    );

    if (!geminiReport) {
      console.error("❌ Gemini Stage 3 failed to generate report");
      return NextResponse.json(
        { error: "Failed to generate comprehensive report" },
        { status: 500 }
      );
    }

    console.log("✅ Comprehensive report generated successfully");

    // Step 3: Combine Gemini report with raw insights for detailed analysis
    const comprehensiveReport = {
      // Main AI-generated report
      aiReport: geminiReport,
      
      // Raw insights for detailed sections
      rawInsights: {
        news: newsInsights,
        serp: serpInsights,
        reddit: redditInsights,
        trends: trendsInsights,
        wiki: wikiInsights
      },
      
      // Metadata
      metadata: {
        idea: idea,
        generatedAt: new Date().toISOString(),
        dataSourcesUsed: [
          newsInsights ? 'News API' : null,
          serpInsights ? 'SERP API' : null,
          redditInsights ? 'Reddit' : null,
          trendsInsights ? 'Google Trends' : null,
          wikiInsights ? 'Wikipedia' : null
        ].filter(Boolean),
        totalSources: [newsInsights, serpInsights, redditInsights, trendsInsights, wikiInsights]
          .filter(Boolean).length
      }
    };

    console.log("📋 Final comprehensive report ready");
    
    return NextResponse.json(comprehensiveReport);

  } catch (error) {
    console.error("🔥 REPORT GENERATION CRASHED:", error);
    return NextResponse.json(
      { 
        error: "Report generation failed unexpectedly", 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}