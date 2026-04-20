import { NextResponse } from "next/server";
import { PROVIDER_MODE } from "@/lib/data/provider";

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      app: "pumpky",
      providerMode: PROVIDER_MODE,
      services: {
        database: hasDatabaseUrl ? "configured" : "missing",
        aiProvider: hasOpenAI ? "configured" : "missing",
      },
    },
    { status: 200 }
  );
}
