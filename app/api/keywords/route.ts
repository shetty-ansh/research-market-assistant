import { NextRequest, NextResponse } from "next/server";
import { geminiStageOne } from "../sources/geminiController";

interface StageOneKeywords {
  newsInput?: string
  serpInput?: string
  wikiInput?: string
  redditInput?: string
  trendsInput?: string
}

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    const result = await geminiStageOne(idea);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to generate keywords" },
        { status: 500 }
      );
    }

    const keywords: StageOneKeywords = result;
    // console.log(keywords)
    return NextResponse.json({ keywords });
  } catch {
    return NextResponse.json(
      { error: "Keyword generation failed" },
      { status: 500 }
    );
  }
}
