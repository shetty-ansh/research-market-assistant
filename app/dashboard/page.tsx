// app/dashboard/page.tsx

"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      // Navigate to report page with the idea as a query parameter
      const encodedIdea = encodeURIComponent(idea);
      window.location.href = `/report?idea=${encodedIdea}`;
    } catch (err: any) {
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-100 flex justify-center">
      <div className="w-full max-w-2xl p-8 mt-10 bg-white shadow-xl border border-stone-200">
        <h1 className="text-2xl font-bold text-black mb-6 tracking-tight">
          Business Viability Dashboard
        </h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="idea"
              className="block text-xs font-semibold uppercase tracking-widest text-black mb-3"
            >
              Describe your business idea
            </label>

            <textarea
              id="idea"
              name="idea"
              rows={6}
              className="w-full px-4 py-3 border-2 border-stone-200 text-sm focus:outline-none focus:border-black transition-colors resize-none text-black bg-stone-50"
              placeholder="Describe your business idea in 3–5 lines..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={isLoading}
              maxLength={1000}
              style={{ fontWeight: 400 }}
            />

            <div
              className="mt-2 text-xs text-black"
              style={{ fontWeight: 400 }}
            >
              {idea.length}/1000 characters
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 p-4">
              <div className="text-xs text-red-700 font-medium">{error}</div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !idea.trim()}
            className="w-full py-4 px-6 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Report...
              </div>
            ) : (
              "Generate Viability Report"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
