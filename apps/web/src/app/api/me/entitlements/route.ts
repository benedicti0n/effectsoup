import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const session = await auth.api.getSession({ headers: new Headers() });

  if (!session) {
    return NextResponse.json({ isPremium: false, role: "guest" });
  }

  // Production: query subscriptions table. For now return free signed-in state.
  return NextResponse.json({
    isPremium: false,
    role: "free",
    userId: session.user.id
  });
}
