import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { signAdminToken, setAdminCookie } from "@/lib/auth";
import { User, isLelekAdmin } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user || !isLelekAdmin(user)) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      adminRole: user.adminRole ?? "lelek_admin",
    });

    const response = NextResponse.json({
      ok: true,
      admin: { email: user.email, name: user.name, adminRole: user.adminRole },
    });
    return setAdminCookie(response, token);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
