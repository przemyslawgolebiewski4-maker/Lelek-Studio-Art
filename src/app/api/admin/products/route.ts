import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, isUnauthorized } from "@/lib/auth";
import { Product } from "@/models";

export async function GET() {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  await connectDB();
  const products = await Product.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, products });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    await connectDB();

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim().toLowerCase().replace(/\s+/g, "-")
        : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!slug || !title) {
      return NextResponse.json({ ok: false, error: "Slug and title required" }, { status: 400 });
    }

    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 409 });
    }

    const product = await Product.create({
      slug,
      catalog: body.catalog ?? "",
      title,
      category: body.category ?? "ceramics",
      material: body.material ?? "",
      description: body.description ?? "",
      process: body.process ?? "",
      etsyUrl: body.etsyUrl ?? "",
      images: Array.isArray(body.images) ? body.images : [],
      metaTitle: body.metaTitle ?? "",
      metaDescription: body.metaDescription ?? "",
      published: Boolean(body.published),
      order: Number(body.order) || 0,
    });

    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Create failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
