import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const paths: string[] = Array.isArray(body.paths) ? body.paths : [];
  const tags: string[] = Array.isArray(body.tags) ? body.tags : [];

  for (const path of paths) revalidatePath(path);
  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ ok: true, revalidated: { paths, tags } });
}
