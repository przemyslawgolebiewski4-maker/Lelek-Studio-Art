import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { User, isLelekAdmin } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).lean();
    if (!user || !isLelekAdmin(user)) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        adminRole: user.adminRole,
        adminPermissions: user.adminPermissions,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Session check failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
