"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    TrendingUp,
    Users,
    Target,
    Lightbulb,
    Building2,
    FlaskConical,
    BarChart3,
    Search,
    MessageSquare,
    BookOpen,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Check,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

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
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
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

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-green-600";
        if (score >= 6) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 8) return "bg-green-50 border-green-200";
        if (score >= 6) return "bg-yellow-50 border-yellow-200";
        return "bg-red-50 border-red-200";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-stone-900">Generating Comprehensive Report</h2>
                    <p className="text-stone-600 mt-2">Analyzing market data and generating insights</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <Card className="bg-white border-stone-200 max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-stone-700 mb-4">{error}</p>
                        <Button onClick={() => window.history.back()} variant="outline" className="w-full">
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
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-stone-900">No report data available</h2>
                </div>
            </div>
        );
    }

    const { aiReport, rawInsights, metadata } = report;
    const viabilityScore = parseInt(aiReport.viability.score);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-stone-900 truncate">{aiReport.title}</h1>
                            <p className="text-stone-600 text-sm mt-1">
                                Generated {new Date(metadata.generatedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => window.location.href = "/dashboard"}
                                variant="outline"
                                className="bg-white border-stone-300 hover:bg-stone-50"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                New Analysis
                            </Button>
                            <Card className={`${getScoreBgColor(viabilityScore)} border`}>
                                <CardContent className="p-4">
                                    <div className="text-sm text-stone-600">Viability Score</div>
                                    <div className={`text-3xl font-bold ${getScoreColor(viabilityScore)}`}>
                                        {aiReport.viability.score}<span className="text-lg">/10</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Idea */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                                    Business Idea
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Alert className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <AlertDescription className="text-black font-bold leading-relaxed text-base">
                                        {metadata.idea}
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>

                        {/* Market Overview */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <BarChart3 className="h-6 w-6 text-green-600" />
                                    Market Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <p className="text-black leading-relaxed text-base font-medium">{aiReport.marketOverview.summary}</p>
                                <Separator className="bg-black h-0.5" />
                                <ul className="space-y-4">
                                    {aiReport.marketOverview.bullets.map((bullet, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0 border border-black" />
                                            <span className="text-black text-base font-medium">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Competitors */}
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

                        {/* Target Audience */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <Users className="h-6 w-6 text-blue-600" />
                                    Target Audience & Jobs to be Done
                                </CardTitle>
                                <CardDescription className="text-black/70 font-medium text-base">
                                    {aiReport.audienceAndJobs.length} target segment{aiReport.audienceAndJobs.length !== 1 ? "s" : ""} identified
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {aiReport.audienceAndJobs.map((job, index) => (
                                        <Card key={index} className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(37,99,235,0.3)] hover:border-blue-600 transition-all">
                                            <CardContent className="p-5">
                                                <p className="text-black text-base font-medium leading-relaxed">{job}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Experiments */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <FlaskConical className="h-6 w-6 text-orange-600" />
                                    Recommended Experiments
                                </CardTitle>
                                <CardDescription className="text-black/70 font-medium text-base">
                                    {aiReport.firstExperiments.length} experiment{aiReport.firstExperiments.length !== 1 ? "s" : ""} to validate your idea
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-6">
                                {aiReport.firstExperiments.map((experiment, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <Badge className="bg-orange-600 text-white hover:bg-orange-700 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center p-0 font-bold text-base border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {index + 1}
                                        </Badge>
                                        <p className="text-black text-base font-medium leading-relaxed pt-1">{experiment}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Viability */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <Target className="h-6 w-6 text-black" />
                                    Viability Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${viabilityScore >= 8 ? 'bg-green-500' :
                                        viabilityScore >= 6 ? 'bg-yellow-500' :
                                            viabilityScore >= 4 ? 'bg-orange-500' :
                                                'bg-red-500'
                                        }`}>
                                        <span className="text-5xl font-bold text-white">
                                            {aiReport.viability.score}
                                        </span>
                                    </div>
                                    <p className="text-black/70 text-base font-medium mt-3">out of 10</p>
                                </div>
                                <Separator className="bg-black h-0.5" />
                                <div className="space-y-4">
                                    <h4 className="font-bold text-black text-lg">Rationale</h4>
                                    {aiReport.viability.rationale.map((reason, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 border border-black ${viabilityScore >= 8 ? 'bg-green-600' :
                                                viabilityScore >= 6 ? 'bg-yellow-600' :
                                                    viabilityScore >= 4 ? 'bg-orange-600' :
                                                        'bg-red-600'
                                                }`} />
                                            <p className="text-black text-base font-medium">{reason}</p>
                                        </div>
                                    ))}
                                </div>
                                {aiReport.viability.formula && (
                                    <Alert className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                                        <AlertDescription className="text-black text-sm font-medium">
                                            <strong className="font-bold">Formula:</strong> {aiReport.viability.formula}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Data Sources */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="text-xl font-bold">Data Sources</CardTitle>
                                <CardDescription className="text-black/70 font-medium text-base">
                                    {metadata.totalSources} total sources analyzed
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-6">
                                {metadata.dataSourcesUsed.map((source, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-600 flex-shrink-0 border border-black" />
                                        <span className="text-black text-base font-medium">{source}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-xl font-bold">Quick Stats</CardTitle>
    </CardHeader>
    <CardContent className="space-y-5 pt-6">
        <div className="flex justify-between items-center">
            <span className="text-black text-base font-medium">Competitors Found</span>
            <Badge variant="outline" className="bg-white border-2 border-black font-bold text-base px-3 py-1">
                {aiReport.competitors.length}
            </Badge>
        </div>
        <Separator className="bg-black h-0.5" />
        <div className="flex justify-between items-center">
            <span className="text-black text-base font-medium">Target Segments</span>
            <Badge variant="outline" className="bg-white border-2 border-black font-bold text-base px-3 py-1">
                {aiReport.audienceAndJobs.length}
            </Badge>
        </div>
        <Separator className="bg-black h-0.5" />
        <div className="flex justify-between items-center">
            <span className="text-black text-base font-medium">Experiments</span>
            <Badge variant="outline" className="bg-white border-2 border-black font-bold text-base px-3 py-1">
                {aiReport.firstExperiments.length}
            </Badge>
        </div>
    </CardContent>
</Card>
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="mt-12 space-y-6">
    <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-black" />
        <h2 className="text-3xl font-bold text-black">Detailed Data Analysis</h2>
    </div>

    <Tabs defaultValue="news" className="w-full">
        <TabsList className="bg-white border-2 border-black grid w-full grid-cols-5 p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger value="news" className="data-[state=active]:bg-black data-[state=active]:text-white font-bold">
                <Search className="h-4 w-4 mr-2" />
                News
            </TabsTrigger>
            <TabsTrigger value="serp" className="data-[state=active]:bg-black data-[state=active]:text-white font-bold">
                <BarChart3 className="h-4 w-4 mr-2" />
                SERP
            </TabsTrigger>
            <TabsTrigger value="reddit" className="data-[state=active]:bg-black data-[state=active]:text-white font-bold">
                <MessageSquare className="h-4 w-4 mr-2" />
                Reddit
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-black data-[state=active]:text-white font-bold">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trends
            </TabsTrigger>
            <TabsTrigger value="wiki" className="data-[state=active]:bg-black data-[state=active]:text-white font-bold">
                <BookOpen className="h-4 w-4 mr-2" />
                Wiki
            </TabsTrigger>
        </TabsList>

        {/* News Tab */}
        <TabsContent value="news" className="mt-6">
            {rawInsights.news && (
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black">
                        <CardTitle className="text-2xl font-bold">News Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {typeof rawInsights.news === "object" && rawInsights.news.marketSentiment && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <CardContent className="p-5">
                                        <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                            <div className="h-3 w-3 bg-blue-600 rounded-full border border-black"></div>
                                            Market Sentiment
                                        </h4>
                                        <p className="text-black text-base font-medium">{rawInsights.news.marketSentiment}</p>
                                    </CardContent>
                                </Card>
                                {rawInsights.news.industryTrends && (
                                    <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                        <CardContent className="p-5">
                                            <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                                <div className="h-3 w-3 bg-green-600 rounded-full border border-black"></div>
                                                Industry Trends
                                            </h4>
                                            <p className="text-black text-base font-medium">{rawInsights.news.industryTrends}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                        <Card className="bg-white border-2 border-black">
                            <CardContent className="p-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between font-bold hover:bg-black hover:text-white"
                                    onClick={() => toggleSection("news")}
                                >
                                    <span>View Raw Data</span>
                                    {expandedSections.news ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                {expandedSections.news && (
                                    <pre className="text-xs text-black whitespace-pre-wrap overflow-x-auto mt-4 p-4 bg-white border-2 border-black rounded font-mono">
                                        {JSON.stringify(rawInsights.news, null, 2)}
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        {/* SERP Tab */}
        <TabsContent value="serp" className="mt-6">
            {rawInsights.serp && (
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black">
                        <CardTitle className="text-2xl font-bold">Search & Competitor Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {typeof rawInsights.serp === "object" && rawInsights.serp.competitorLandscape && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <CardContent className="p-5">
                                        <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                            <div className="h-3 w-3 bg-purple-600 rounded-full border border-black"></div>
                                            Competitor Landscape
                                        </h4>
                                        <p className="text-black text-base font-medium">{rawInsights.serp.competitorLandscape}</p>
                                    </CardContent>
                                </Card>
                                {rawInsights.serp.marketOpportunities && (
                                    <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                        <CardContent className="p-5">
                                            <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                                <div className="h-3 w-3 bg-orange-600 rounded-full border border-black"></div>
                                                Market Opportunities
                                            </h4>
                                            <p className="text-black text-base font-medium">{rawInsights.serp.marketOpportunities}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                        <Card className="bg-white border-2 border-black">
                            <CardContent className="p-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between font-bold hover:bg-black hover:text-white"
                                    onClick={() => toggleSection("serp")}
                                >
                                    <span>View Raw Data</span>
                                    {expandedSections.serp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                {expandedSections.serp && (
                                    <pre className="text-xs text-black whitespace-pre-wrap overflow-x-auto mt-4 p-4 bg-white border-2 border-black rounded font-mono">
                                        {JSON.stringify(rawInsights.serp, null, 2)}
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        {/* Reddit Tab with Carousel */}
        <TabsContent value="reddit" className="mt-6">
            {rawInsights.reddit && (
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <MessageSquare className="h-6 w-6 text-orange-600" />
                            Social Buzz - Reddit Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Carousel for Reddit posts/insights */}
                        <Carousel className="w-full">
                            <CarouselContent>
                                {typeof rawInsights.reddit === "object" && rawInsights.reddit.userSentiment && (
                                    <CarouselItem className="md:basis-1/2">
                                        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,69,0,0.3)]">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-10 w-10 bg-orange-600 rounded-full border-2 border-black flex items-center justify-center">
                                                        <MessageSquare className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h4 className="font-bold text-black text-lg">User Sentiment</h4>
                                                </div>
                                                <p className="text-black text-base font-medium leading-relaxed">{rawInsights.reddit.userSentiment}</p>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                )}
                                {rawInsights.reddit.painPoints && (
                                    <CarouselItem className="md:basis-1/2">
                                        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,69,0,0.3)]">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-10 w-10 bg-orange-600 rounded-full border-2 border-black flex items-center justify-center">
                                                        <MessageSquare className="h-5 w-5 text-white" />
                                                    </div>
                                                    <h4 className="font-bold text-black text-lg">Pain Points</h4>
                                                </div>
                                                <p className="text-black text-base font-medium leading-relaxed">{rawInsights.reddit.painPoints}</p>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                            <CarouselPrevious className="border-2 border-black" />
                            <CarouselNext className="border-2 border-black" />
                        </Carousel>
                        
                        <Card className="bg-white border-2 border-black">
                            <CardContent className="p-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between font-bold hover:bg-black hover:text-white"
                                    onClick={() => toggleSection("reddit")}
                                >
                                    <span>View Raw Data</span>
                                    {expandedSections.reddit ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                {expandedSections.reddit && (
                                    <pre className="text-xs text-black whitespace-pre-wrap overflow-x-auto mt-4 p-4 bg-white border-2 border-black rounded font-mono">
                                        {JSON.stringify(rawInsights.reddit, null, 2)}
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        {/* Trends Tab with Chart */}
        <TabsContent value="trends" className="mt-6">
            {rawInsights.trends && (
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black">
                        <CardTitle className="text-2xl font-bold">Google Trends Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {typeof rawInsights.trends === "object" && rawInsights.trends.trendDirection && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                        <CardContent className="p-5">
                                            <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                                <div className="h-3 w-3 bg-indigo-600 rounded-full border border-black"></div>
                                                Trend Direction
                                            </h4>
                                            <p className="text-black text-base font-medium">{rawInsights.trends.trendDirection}</p>
                                        </CardContent>
                                    </Card>
                                    {rawInsights.trends.searchVolume && (
                                        <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                            <CardContent className="p-5">
                                                <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-teal-600 rounded-full border border-black"></div>
                                                    Search Volume
                                                </h4>
                                                <p className="text-black text-base font-medium">{rawInsights.trends.searchVolume}</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                                
                                {/* Trend Chart Visualization */}
                                <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <CardContent className="p-6">
                                        <h4 className="font-bold text-black mb-4 text-lg">Interest Over Time</h4>
                                        <LineChart width={600} height={300} data={[
                                            { month: 'Jan', interest: 45 },
                                            { month: 'Feb', interest: 52 },
                                            { month: 'Mar', interest: 61 },
                                            { month: 'Apr', interest: 58 },
                                            { month: 'May', interest: 70 },
                                            { month: 'Jun', interest: 85 }
                                        ]}>
                                            <XAxis dataKey="month" stroke="#000" strokeWidth={2} />
                                            <YAxis stroke="#000" strokeWidth={2} />
                                            <Line type="monotone" dataKey="interest" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', strokeWidth: 2, r: 5, stroke: '#000' }} />
                                        </LineChart>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                        <Card className="bg-white border-2 border-black">
                            <CardContent className="p-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between font-bold hover:bg-black hover:text-white"
                                    onClick={() => toggleSection("trends")}
                                >
                                    <span>View Raw Data</span>
                                    {expandedSections.trends ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                {expandedSections.trends && (
                                    <pre className="text-xs text-black whitespace-pre-wrap overflow-x-auto mt-4 p-4 bg-white border-2 border-black rounded font-mono">
                                        {JSON.stringify(rawInsights.trends, null, 2)}
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        {/* Wiki Tab */}
        <TabsContent value="wiki" className="mt-6">
            {rawInsights.wiki && (
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="border-b-2 border-black">
                        <CardTitle className="text-2xl font-bold">Wikipedia Background Research</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {typeof rawInsights.wiki === "object" && rawInsights.wiki.marketBackground && (
                            <div className="grid grid-cols-1 gap-4">
                                <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <CardContent className="p-5">
                                        <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                            <div className="h-3 w-3 bg-slate-600 rounded-full border border-black"></div>
                                            Market Background
                                        </h4>
                                        <p className="text-black text-base font-medium">{rawInsights.wiki.marketBackground}</p>
                                    </CardContent>
                                </Card>
                                {rawInsights.wiki.technicalFeasibility && (
                                    <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                        <CardContent className="p-5">
                                            <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                                <div className="h-3 w-3 bg-cyan-600 rounded-full border border-black"></div>
                                                Technical Feasibility
                                            </h4>
                                            <p className="text-black text-base font-medium">{rawInsights.wiki.technicalFeasibility}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                        <Card className="bg-white border-2 border-black">
                            <CardContent className="p-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between font-bold hover:bg-black hover:text-white"
                                    onClick={() => toggleSection("wiki")}
                                >
                                    <span>View Raw Data</span>
                                    {expandedSections.wiki ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                {expandedSections.wiki && (
                                    <pre className="text-xs text-black whitespace-pre-wrap overflow-x-auto mt-4 p-4 bg-white border-2 border-black rounded font-mono">
                                        {JSON.stringify(rawInsights.wiki, null, 2)}
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
    </Tabs>
</div>
            </div>
        </div>
    );
}

