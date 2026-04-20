import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { PROVIDER_MODE } from "@/lib/data/provider";

export const metadata = { title: "API Status" };

export default function StatusPage() {
  const statusRows = [
    {
      name: "Data provider mode",
      value: PROVIDER_MODE,
      ok: true,
      note: PROVIDER_MODE === "demo" ? "Mock provider active" : "Live provider active",
    },
    {
      name: "Database",
      value: process.env.DATABASE_URL ? "configured" : "missing",
      ok: Boolean(process.env.DATABASE_URL),
      note: "Prisma + PostgreSQL",
    },
    {
      name: "OpenAI key",
      value: process.env.OPENAI_API_KEY ? "configured" : "missing",
      ok: Boolean(process.env.OPENAI_API_KEY),
      note: "Used for future AI summarization endpoint",
    },
    {
      name: "DexScreener key",
      value: process.env.DEXSCREENER_API_KEY ? "configured" : "missing",
      ok: true,
      note: "Optional for live market feed adapter",
    },
  ];

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 gap-5">
      <div>
        <h1 className="text-xl font-semibold text-white/85 tracking-tight">API Status</h1>
        <p className="terminal-text text-[11px] text-[#444] mt-1">
          Runtime health and integration readiness.
        </p>
      </div>

      <TerminalPanel title="Environment health" subtitle="server-side" status="demo">
        <div className="space-y-2">
          {statusRows.map((row) => (
            <div
              key={row.name}
              className="rounded border border-white/[0.06] bg-[#0b0b0b] px-3 py-2 flex items-center gap-2"
            >
              <span
                className={`w-2 h-2 rounded-full ${row.ok ? "bg-green-primary" : "bg-warning"}`}
                style={{ boxShadow: row.ok ? "0 0 6px rgba(0,255,65,0.7)" : "0 0 6px rgba(255,170,0,0.7)" }}
              />
              <div className="flex-1">
                <div className="terminal-text text-xs text-white/80">{row.name}</div>
                <div className="terminal-text text-[10px] text-[#666]">{row.note}</div>
              </div>
              <span className="terminal-text text-[10px] uppercase tracking-widest text-green-primary/80">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </TerminalPanel>

      <TerminalPanel title="Health endpoint" status="demo">
        <p className="text-sm text-[#777] leading-relaxed">
          Ping <code>/api/health</code> for machine-readable status checks.
        </p>
      </TerminalPanel>
    </div>
  );
}
