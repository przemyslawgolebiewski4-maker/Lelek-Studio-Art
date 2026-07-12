const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const SETUP_SECRET = process.env.SETUP_SECRET;

async function main() {
  if (!SETUP_SECRET) {
    console.error("SETUP_SECRET missing. Set it in backend/.env or export it.");
    process.exit(1);
  }

  const force = process.argv.includes("--force");
  const url = new URL(`${API_URL}/setup/seed`);
  url.searchParams.set("secret", SETUP_SECRET);
  if (force) url.searchParams.set("force", "true");

  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  process.exit(res.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
