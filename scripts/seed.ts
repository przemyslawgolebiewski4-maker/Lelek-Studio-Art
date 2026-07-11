import { seedDatabase } from "../src/lib/seed-database";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL missing. Set it in .env.local or export it.");
    process.exit(1);
  }

  const result = await seedDatabase({ force: process.argv.includes("--force") });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
