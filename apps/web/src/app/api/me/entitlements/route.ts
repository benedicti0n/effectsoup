import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/schema";
import { getCachedEntitlement, setCachedEntitlement } from "@/lib/redis";

const ACTIVE_STATUSES = ["active", "trialing"];

export async function GET(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ isPremium: false, role: "guest" });
  }

  const cached = await getCachedEntitlement(session.user.id);
  if (cached !== null) {
    return NextResponse.json({
      isPremium: cached,
      role: cached ? "premium" : "free",
      userId: session.user.id
    });
  }

  let isPremium = false;
  try {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1);
    isPremium = sub.length > 0 && ACTIVE_STATUSES.includes(sub[0].status);
  } catch {
    isPremium = false;
  }

  await setCachedEntitlement(session.user.id, isPremium);

  return NextResponse.json({
    isPremium,
    role: isPremium ? "premium" : "free",
    userId: session.user.id
  });
}
