import { PrismaClient, Chain } from "@prisma/client";
import { DEMO_TOKENS } from "../lib/data/demo-tokens";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Pumpky database...");

  // Clear existing data
  await prisma.alert.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.tokenSnapshot.deleteMany();
  await prisma.token.deleteMany();

  console.log("✓ Cleared existing data");

  // Seed tokens
  for (const demo of DEMO_TOKENS) {
    const token = await prisma.token.create({
      data: {
        symbol: demo.symbol,
        name: demo.name,
        chain: demo.chain as Chain,
        address: demo.address,
        logoUrl: demo.logoUrl ?? null,
        website: demo.website ?? null,
        twitter: demo.twitter ?? null,
        telegram: demo.telegram ?? null,
        description: demo.description ?? null,
        launchedAt: demo.launchedAt ? new Date(demo.launchedAt) : null,
      },
    });

    await prisma.tokenSnapshot.create({
      data: {
        tokenId: token.id,
        price: demo.price,
        priceChange1h: demo.priceChange1h,
        priceChange24h: demo.priceChange24h,
        priceChange7d: demo.priceChange7d,
        volume24h: demo.volume24h,
        volumeChange24h: demo.volumeChange24h,
        liquidity: demo.liquidity,
        marketCap: demo.marketCap,
        fdv: demo.fdv,
        holders: demo.holders,
        transactions24h: demo.transactions24h,
        buys24h: demo.buys24h,
        sells24h: demo.sells24h,
        opportunityScore: demo.scores.opportunity,
        riskScore: demo.scores.risk,
        momentumScore: demo.scores.momentum,
        sentimentScore: demo.scores.sentiment,
        liquidityScore: demo.scores.liquidity,
        aiSummary: JSON.stringify(demo.aiSummary),
        aiUpdatedAt: new Date(),
      },
    });
  }

  console.log(`✓ Seeded ${DEMO_TOKENS.length} tokens with snapshots`);

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@pumpky.xyz" },
    update: {},
    create: {
      email: "demo@pumpky.xyz",
      name: "Demo Trader",
    },
  });

  // Add some watchlist items
  const tokens = await prisma.token.findMany({ take: 5 });
  for (const token of tokens) {
    await prisma.watchlistItem.create({
      data: {
        userId: user.id,
        tokenId: token.id,
        notes: "Watching for breakout",
        tags: ["high-conviction", "defi"],
      },
    });
  }

  console.log("✓ Created demo user with watchlist");
  console.log("\n🚀 Seed complete! Run: npm run dev");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
