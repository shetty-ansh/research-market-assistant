



"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    Users,
    Target,
    Lightbulb,
    Building2,
    FlaskConical,
    BarChart3,
    ArrowLeft,
    ExternalLink,
    Check,
    AlertCircle,
    Home
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { MenuContainer, MenuItem } from "@/components/ui/fluid-menu";


interface GeminiReport {
    title: string;
    marketOverview: {
        summary: string;
        bullets: string[];
    };
    audienceAndJobs: string[];
    competitors: {
        name: string;
        pitch: string;
        link: string;
        differentiate: string;
    }[];
    viability: {
        score: string;
        rationale: string[];
        formula: string;
    };
    firstExperiments: string[];
    sources: string[];
}

interface ComprehensiveReport {
    aiReport: GeminiReport;
    rawInsights: {
        news: any;
        serp: any;
        reddit: any;
        trends: any;
        wiki: any;
    };
    metadata: {
        idea: string;
        generatedAt: string;
        dataSourcesUsed: string[];
        totalSources: number;
    };
}

export default function ReportPage() {
    const [report, setReport] = useState<ComprehensiveReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");
    const searchParams = useSearchParams();
    const idea = searchParams.get("idea");

    useEffect(() => {
        if (!idea) {
            setError("No business idea provided");
            setIsLoading(false);
            return;
        }
        generateReport();
    }, [idea]);

    const generateReport = async () => {
        try {
            setIsLoading(true);
            setError("");
            const response = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idea }),
            });
            if (!response.ok) throw new Error("Failed to generate report");
            const reportData = await response.json();
            setReport(reportData);
        } catch (err: any) {
            setError(err.message || "Failed to generate report");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-green-700";
        if (score >= 6) return "text-amber-700";
        return "text-red-700";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 8) return "bg-green-50 border-green-300";
        if (score >= 6) return "bg-amber-50 border-amber-300";
        return "bg-red-50 border-red-300";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-amber-900">Generating Business Viability Report</h2>
                    <p className="text-amber-700 mt-2">Analyzing market data and generating insights</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
                <Card className="bg-white border-amber-200 max-w-md w-full shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-red-700 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-800 mb-4">{error}</p>
                        <Button onClick={() => window.history.back()} variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-50">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-amber-900">No report data available</h2>
                </div>
            </div>
        );
    }

    const { aiReport, rawInsights, metadata } = report;
    const viabilityScore = parseInt(aiReport.viability.score);

    const renderOverviewSection = () => (
        <div className="space-y-8">
            {/* Report Cover */}
            <div className="text-center space-y-6 py-16">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-amber-900 leading-tight">
                        Business Viability Report
                    </h1>
                    <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
                    <h2 className="text-2xl text-amber-800 font-medium">
                        {aiReport.title}
                    </h2>
                </div>

                {/* Viability Score Display */}
                <div className="flex justify-center mt-12">
                    <Card className={`${getScoreBgColor(viabilityScore)} border-2 shadow-lg`}>
                        <CardContent className="p-8 text-center">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-amber-700 uppercase tracking-wide">
                                    Overall Viability Score
                                </p>
                                <div className={`text-6xl font-bold ${getScoreColor(viabilityScore)}`}>
                                    {aiReport.viability.score}
                                    <span className="text-3xl text-amber-600">/10</span>
                                </div>
                                <div className="w-16 h-1 bg-amber-400 mx-auto mt-4"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Executive Summary */}
                <div className="max-w-3xl mx-auto mt-16">
                    <Card className="bg-white border-amber-200 shadow-sm">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl text-amber-900">Executive Summary</CardTitle>
                            <div className="w-12 h-0.5 bg-amber-400 mx-auto"></div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="bg-amber-50 border-amber-200">
                                <Lightbulb className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-800 leading-relaxed">
                                    <strong>Business Concept:</strong> {metadata.idea}
                                </AlertDescription>
                            </Alert>
                            <p className="text-amber-800 leading-relaxed text-center">
                                {aiReport.marketOverview.summary}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Metadata */}
                <div className="mt-16 text-center text-sm text-amber-600">
                    <p>Report Generated: {new Date(metadata.generatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}</p>
                    <p className="mt-1">Data Sources: {metadata.totalSources} sources analyzed</p>
                </div>
            </div>
        </div>
    );

    const renderMarketSection = () => (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Market Analysis</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            </div>

            <Card className="bg-white border-amber-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900">
                        <BarChart3 className="h-5 w-5 text-amber-600" />
                        Market Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-amber-800 leading-relaxed text-lg">{aiReport.marketOverview.summary}</p>
                    <Separator className="bg-amber-200" />
                    <div className="space-y-4">
                        <h4 className="font-semibold text-amber-900">Key Market Insights</h4>
                        <ul className="space-y-3">
                            {aiReport.marketOverview.bullets.map((bullet, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                                    <span className="text-amber-800 leading-relaxed">{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderCompetitorsSection = () => (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Competitive Landscape</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            </div>

            {aiReport.competitors.length > 0 && (
        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Building2 className="h-6 w-6 text-black" />
              Competitor Analysis
            </CardTitle>
            <CardDescription className="text-black/70 font-medium text-base">
              {aiReport.competitors.length} competitor{aiReport.competitors.length !== 1 ? "s" : ""} identified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {aiReport.competitors.map((competitor, index) => (
              <Card key={index} className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-black text-xl">{competitor.name}</h3>
                    {competitor.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-black hover:bg-black hover:text-white"
                        onClick={() => window.open(competitor.link, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-black/80 text-base leading-relaxed">{competitor.pitch}</p>
                  <Alert className="bg-white border-2 border-black">
                    <Check className="h-5 w-5 text-black font-bold" strokeWidth={3} />
                    <AlertDescription className="text-black text-base">
                      <strong className="font-bold">Differentiation:</strong> {competitor.differentiate}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
        </div>
    );

    const renderAudienceSection = () => (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Target Audience Analysis</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            </div>

            <Card className="bg-white border-amber-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900">
                        <Users className="h-5 w-5 text-amber-600" />
                        Jobs to be Done
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                        {aiReport.audienceAndJobs.length} target segment{aiReport.audienceAndJobs.length !== 1 ? "s" : ""} identified
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        {aiReport.audienceAndJobs.map((job, index) => (
                            <Card key={index} className="bg-amber-50 border-amber-200">
                                <CardContent className="p-4">
                                    <p className="text-amber-800 leading-relaxed">{job}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderExperimentsSection = () => (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Recommended Experiments</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            </div>

            <Card className="bg-white border-amber-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900">
                        <FlaskConical className="h-5 w-5 text-amber-600" />
                        Validation Experiments
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                        {aiReport.firstExperiments.length} experiment{aiReport.firstExperiments.length !== 1 ? "s" : ""} to validate your business idea
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiReport.firstExperiments.map((experiment, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Badge className="bg-amber-600 text-white hover:bg-amber-700 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center p-0 text-sm font-bold">
                                {index + 1}
                            </Badge>
                            <p className="text-amber-800 leading-relaxed pt-1">{experiment}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );

    const renderViabilitySection = () => (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Viability Assessment</h2>
                <div className="w-16 h-1 bg-amber-600 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className={`${getScoreBgColor(viabilityScore)} border-2 shadow-lg`}>
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-amber-900">
                            <Target className="h-5 w-5" />
                            Overall Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(viabilityScore)} border-4`}>
                            <span className={`text-5xl font-bold ${getScoreColor(viabilityScore)}`}>
                                {aiReport.viability.score}
                            </span>
                        </div>
                        <p className="text-amber-700 font-medium">out of 10</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-amber-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-amber-900">Assessment Rationale</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {aiReport.viability.rationale.map((reason, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="mt-2 h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                                <p className="text-amber-800 leading-relaxed">{reason}</p>
                            </div>
                        ))}
                        {aiReport.viability.formula && (
                            <Alert className="bg-amber-50 border-amber-200 mt-6">
                                <AlertDescription className="text-amber-800">
                                    <strong>Scoring Formula:</strong> {aiReport.viability.formula}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-amber-50 text-amber-900">
            {/* Fixed Navigation */}
            <div className="fixed top-6 right-6 z-50">
                <MenuContainer>
                    <MenuItem
                        icon={<Home className="h-5 w-5" />}
                        onClick={() => setActiveSection("overview")}
                        isActive={activeSection === "overview"}
                    />
                    <MenuItem
                        icon={<BarChart3 className="h-5 w-5" />}
                        onClick={() => setActiveSection("market")}
                        isActive={activeSection === "market"}
                    />
                    <MenuItem
                        icon={<Building2 className="h-5 w-5" />}
                        onClick={() => setActiveSection("competitors")}
                        isActive={activeSection === "competitors"}
                    />
                    <MenuItem
                        icon={<Users className="h-5 w-5" />}
                        onClick={() => setActiveSection("audience")}
                        isActive={activeSection === "audience"}
                    />
                    <MenuItem
                        icon={<FlaskConical className="h-5 w-5" />}
                        onClick={() => setActiveSection("experiments")}
                        isActive={activeSection === "experiments"}
                    />
                    <MenuItem
                        icon={<Target className="h-5 w-5" />}
                        onClick={() => setActiveSection("viability")}
                        isActive={activeSection === "viability"}
                    />
                </MenuContainer>
            </div>

            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <Button
                    onClick={() => window.location.href = "/dashboard"}
                    variant="outline"
                    className="bg-white border-amber-300 text-amber-800 hover:bg-amber-50 shadow-lg"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    New Analysis
                </Button>
            </div>

            {/* Main Content */}
                        <div className="max-w-4xl mx-auto px-6 py-12">
                {activeSection === "overview" && renderOverviewSection()}
                {activeSection === "market" && renderMarketSection()}
                {activeSection === "competitors" && renderCompetitorsSection()}
                {activeSection === "audience" && renderAudienceSection()}
                {activeSection === "experiments" && renderExperimentsSection()}
                {activeSection === "viability" && renderViabilitySection()}
            </div>
        </div>
    );
}
