import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, isUnauthorized } from "@/lib/auth";
import { Product } from "@/models";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, product });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDB();

    const allowed = [
      "slug",
      "catalog",
      "title",
      "category",
      "material",
      "description",
      "process",
      "etsyUrl",
      "images",
      "metaTitle",
      "metaDescription",
      "published",
      "order",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.trim().toLowerCase().replace(/\s+/g, "-");
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;
  await connectDB();
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
