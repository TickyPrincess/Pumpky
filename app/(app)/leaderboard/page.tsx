import { fetchTokens } from "@/lib/data/provider";
import { LeaderboardTable } from "@/components/tokens/leaderboard-table";
import { TerminalPanel } from "@/components/terminal/terminal-panel";

export const metadata = { title: "Rankings" };

export default async function LeaderboardPage() {
  const tokens = await fetchTokens({ sortBy: "opportunity", sortDir: "desc" });

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 gap-5">
      <div>
        <h1 className="text-xl font-semibold text-white/85 tracking-tight">Opportunity Rankings</h1>
        <p className="terminal-text text-[11px] text-[#444] mt-1">
          Sortable board of meme coins by opportunity, risk, momentum, and market structure.
        </p>
      </div>

      <TerminalPanel title="Ranking logic" subtitle="how score is computed" status="demo">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
          <Rule title="Momentum" value="30%" description="Price/volume acceleration and buy pressure." />
          <Rule title="Liquidity" value="20%" description="Depth quality and lock profile." />
          <Rule title="Social" value="20%" description="Narrative heat and community velocity." />
          <Rule title="Volume accel" value="15%" description="24h expansion in activity." />
          <Rule title="Narrative" value="15%" description="Current meme-cycle relevance." />
        </div>
      </TerminalPanel>

      <LeaderboardTable tokens={tokens.items} />
    </div>
  );
}

function Rule({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded border border-white/[0.05] bg-[#0b0b0b] p-2.5">
      <div className="terminal-text text-[10px] text-[#555] tracking-widest uppercase">{title}</div>
      <div className="terminal-text text-xs text-green-primary mt-0.5">{value}</div>
      <p className="text-[11px] text-[#6f6f6f] mt-1">{description}</p>
    </div>
  );
}
