import { SparklesPreview } from "@/components/ui/demo";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Feature108 } from "@/components/ui/features";
import { Home, MessageSquare, User, Brain, BarChart3, Search } from "lucide-react";

export default function HomePage() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  const researchFeatures = [
    {
      value: "tab-1",
      icon: <Brain className="h-auto w-4 shrink-0" />,
      label: "Ideate",
      content: {
        badge: "Validate",
        title: "How Viable is the Idea",
        description:
          "Leverage advanced AI algorithms to analyze market trends, competitor landscapes, and business viability with unprecedented accuracy and speed.",
        buttonText: "Start Analysis",
        imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        imageAlt: "AI Analysis Dashboard",
      },
    },
    {
      value: "tab-2",
      icon: <BarChart3 className="h-auto w-4 shrink-0" />,
      label: "Research",
      content: {
        badge: "Data-Driven",
        title: "Comprehensive Market Reports",
        description:
          "Get detailed market analysis with real-time data, industry benchmarks, and predictive insights to make informed business decisions.",
        buttonText: "View Reports",
        imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        imageAlt: "Market Analytics Charts",
      },
    },
    {
      value: "tab-3",
      icon: <Search className="h-auto w-4 shrink-0" />,
      label: "Act",
      content: {
        badge: "Automated Insights",
        title: "Streamlined Research Process",
        description:
          "Automate your research workflow with intelligent data collection, analysis, and report generation across multiple sources and databases.",
        buttonText: "Explore Tools",
        imageSrc: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
        imageAlt: "Research Automation Interface",
      },
    },
  ];

  return (
    <>
      {/* Fixed Floating Navigation */}
      <div className="fixed top-4 left-0 w-full z-[9999] pointer-events-none flex justify-center">
        <div className="pointer-events-auto">
          <FloatingNav navItems={navItems} />
        </div>
      </div>

      {/* Hero Section with Sparkles */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SparklesPreview className="h-full w-full" />
        </div>

      </section>

      {/* Features Section */}
      <Feature108
        badge="I-deate | R-esearch | A-ct"
        heading="Intelligent Research & Analysis Tools"
        description="Discover powerful AI-driven features that transform how you research and analyze business opportunities."
        tabs={researchFeatures}
      />
    </>
  );
}