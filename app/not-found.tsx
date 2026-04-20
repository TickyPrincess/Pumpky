import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
      <div className="panel p-6 max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold text-white/90">Signal lost</h1>
        <p className="text-sm text-[#777]">
          The route you requested is not in the Pumpky terminal map.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex rounded border border-green-primary/30 bg-green-primary/10 px-3 py-1.5 terminal-text text-xs text-green-primary"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
