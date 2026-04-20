import { NextRequest, NextResponse } from "next/server";
import { fetchTokens } from "@/lib/data/provider";
import type { TokenSortKey, Chain } from "@/lib/types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const chain = (params.get("chain") as Chain | "all" | null) ?? "all";
  const search = params.get("search") ?? "";
  const sortBy = (params.get("sortBy") as TokenSortKey | null) ?? "opportunity";
  const sortDir = (params.get("sortDir") as "asc" | "desc" | null) ?? "desc";

  const maxRisk = Number(params.get("maxRisk") ?? "100");
  const minOpportunity = Number(params.get("minOpportunity") ?? "0");

  const data = await fetchTokens({
    chain,
    search,
    sortBy,
    sortDir,
    maxRisk: Number.isFinite(maxRisk) ? maxRisk : 100,
    minOpportunity: Number.isFinite(minOpportunity) ? minOpportunity : 0,
  });

  return NextResponse.json({ data, source: "demo" });
}
