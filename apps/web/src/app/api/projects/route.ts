import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  sourceImageKey: z.string().min(1),
  thumbnailKey: z.string().min(1),
  aspectRatio: z.string().min(1),
  effectGraphJson: z.string().min(1)
});

export async function GET(): Promise<Response> {
  const session = await auth.api.getSession({ headers: new Headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ projects: [] });
}

export async function POST(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: new Headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = createSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Production: insert into projects table and enforce Premium + storage cap.
  return NextResponse.json({ projectId: crypto.randomUUID() });
}
