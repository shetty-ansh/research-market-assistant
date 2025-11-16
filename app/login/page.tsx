"use client";

import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">
          Login Required
        </h1>
        
        <p className="text-stone-600 mb-6 text-center">
          Authentication is not yet implemented. For now, you can access the research tool directly.
        </p>

        <div className="space-y-4">
          <a
            href="/dashboard"
            className="w-full py-3 px-4 bg-black text-white text-center rounded-lg hover:bg-stone-800 transition-colors block"
          >
            Go to Research Dashboard
          </a>
          
          <a
            href="/"
            className="w-full py-3 px-4 bg-stone-100 text-stone-700 text-center rounded-lg hover:bg-stone-200 transition-colors block"
          >
            Back to Home
          </a>
        </div>

        {redirectTo !== "/dashboard" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              You were trying to access: <code className="bg-blue-100 px-1 rounded">{redirectTo}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}