const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const SETUP_SECRET = process.env.SETUP_SECRET;

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find((item) => item.startsWith(prefix));
  return arg?.slice(prefix.length);
}

async function main() {
  if (!SETUP_SECRET) {
    console.error("SETUP_SECRET missing. Export it or pass --secret=...");
    process.exit(1);
  }

  const email = getArg("email");
  const password = getArg("password");
  const name = getArg("name");

  if (!email || !password || !name) {
    console.error("Usage: npm run create-admin -- --email=you@example.com --password=... --name=\"Your Name\"");
    process.exit(1);
  }

  const res = await fetch(`${API_URL}/setup/admin?secret=${encodeURIComponent(SETUP_SECRET)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  process.exit(res.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
